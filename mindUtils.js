import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { GoogleGenAI } from '@google/genai';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mindbase.foujqei.mongodb.net/?retryWrites=true&w=majority&appName=mindbase`;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

const cerebrasClient = new Cerebras({
    apiKey: process.env['CEREBRAS_API_KEY'],
});

export async function addReviewToDB(item) {
  const db = client.db('mindmap');
  const collection = db.collection('movie_reviews');
  const result = await collection.insertOne(item);
  return result.insertedId;
}

export async function generateEmbedding(text) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMMA_API_KEY });
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    taskType: 'SEMANTIC_SIMILARITY'
  });
  const embDoc = response.embeddings?.[0];
  if (!embDoc) throw new Error('No embedding returned from model');
  return Array.isArray(embDoc.values) ? embDoc.values : Array.from(embDoc.values);
}

export async function queryDB(embedding, title, author) {
    const database = client.db("mindmap");
    const coll = database.collection("movie_reviews");
    const agg = [
        {
            $vectorSearch: {
                index: 'vector_index',
                path: 'embedding',
                queryVector: embedding,
                numCandidates: 20,
                limit: 20
            }
        },
        {
            $match: {
                title: { $not: new RegExp(`^${title}$`, 'i') },
                author: { $not: new RegExp(`^${author}$`, 'i') }
            }
        },
        {
            $limit: 3
        },
        {
            $sort: {
                stars: -1
            }
        },
        {
            $limit: 1
        },
        {
            $project: {
                _id: 0,
                title: 1,
                author: 1,
                stars: 1,
                review: 1,
                score: { $meta: 'vectorSearchScore' }
            }
        }
    ];
    const docs = await coll.aggregate(agg).toArray();
    docs.forEach((doc) => console.dir(JSON.stringify(doc)));
    return docs;
}

export async function compareReviews(userInput, similarReview) {
    const completionCreateResponse = await cerebrasClient.chat.completions.create({
        messages: [{ role: 'user', content: `You are part of an app that recommends a user movies based on how similar their review was to someone else\'s review of a different movie. The user\'s review for the movie ${userInput.title} was ${userInput.review} and they gave it ${userInput.stars} stars. The recommended movie was ${similarReview.title}, the review for it was ${similarReview.review} and it was reviewed as ${similarReview.stars} stars. Please answer in less than 60 words, you must justify the suggestion based on the reviews do not attempt to contradict the it or provide other alternatives.` }],
        model: 'llama-4-scout-17b-16e-instruct',
        max_tokens: 200
    });

    return completionCreateResponse?.choices?.[0]?.message?.content;
}
