import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mindbase.foujqei.mongodb.net/?retryWrites=true&w=majority&appName=mindbase`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
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
    });
    const embDoc = response.embeddings?.[0];
    if (!embDoc) throw new Error('No embedding returned from model');
    return Array.isArray(embDoc.values) ? embDoc.values : Array.from(embDoc.values);
}

async function queryDB(embedding) {
    const database = client.db("mindmap");
    const coll = database.collection("movie_reviews");
    const agg = [
        {
            '$vectorSearch': {
                'index': 'vector_index',
                'path': 'embedding',
                'queryVector': embedding,
                'numCandidates': 30,
                'limit': 5
            }
        }, {
            '$project': {
                '_id': 0,
                'title': 1,
                'stars': 1,
                'review': 1,
                'score': {
                    '$meta': 'vectorSearchScore'
                }
            }
        }
    ];
    const docs = await coll.aggregate(agg).toArray();
    docs.forEach((doc) => console.dir(JSON.stringify(doc)));
    return docs;
}

export async function main() {
    await client.connect();
    try {
        const text = 'Spider man is a good movie because of its lack of jeffry epstein as a character and his super powers.';
        const embed = await generateEmbedding(text);
        const item = {
            title: 'Spider man',
            stars: 5,
            review: text,
            embedding: embed

        }
        console.log(embed);
        const results = await queryDB(embed);
        console.log(results);
        const id = await addReviewToDB(item);
        console.log(id)
        return id;
    } finally {
        await client.close();
    }
}

main().catch(err => {
    console.error(err);
});