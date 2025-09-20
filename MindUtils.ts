import * as dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
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

export interface MovieReview {
    title: string;
    author: string;
    stars: number;
    review: string;
    embedding: number[];
}

export interface ReviewWithScore extends MovieReview {
    score: number;
}

export async function addReviewToDB(item: MovieReview): Promise<ObjectId> {
    const db = client.db('mindmap');
    const collection = db.collection('movie_reviews');
    const result = await collection.insertOne(item);
    return result.insertedId;
}

export async function generateEmbedding(text: string): Promise<number[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMMA_API_KEY });
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text
    });
    const embDoc = response.embeddings?.[0];
    if (!embDoc || !embDoc.values) throw new Error('No embedding returned from model');
    return Array.isArray(embDoc.values) ? embDoc.values : Array.from(embDoc.values);
}

export async function queryDB(embedding: number[], title: string, author: string): Promise<ReviewWithScore[]> {
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
    return docs as ReviewWithScore[];
}

export async function compareReviews(userInput: MovieReview, similarReview: ReviewWithScore): Promise<string | undefined> {
    const completionCreateResponse = await cerebrasClient.chat.completions.create({
        messages: [{ role: 'user', content: `You are the charming and helpful chatbot that runs the website MovieMind. Your job is to look at a user's review of a movie and a recommendation for another movie based on a similar user review and explain to the user why the recommendation was made. You must use 60 words or less and should always support the suggestion that was made and never provide alternative suggestions. Use the term "we" and take responsibility for the website's suggestions. The user\'s review for the movie ${userInput.title} was ${userInput.review} and they gave it ${userInput.stars} stars. The recommended movie was ${similarReview.title}, the review for it was ${similarReview.review} and it was reviewed as ${similarReview.stars} stars.` }],
        model: 'llama-4-scout-17b-16e-instruct',
        max_tokens: 200
    });

    return completionCreateResponse?.choices?.[0]?.message?.content;
}
