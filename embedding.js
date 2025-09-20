import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();


async function main() {

    console.log('Project:', process.env.GOOGLE_PROJ_ID);
    console.log('API Key:', process.env.GEMMA_API_KEY);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMMA_API_KEY });

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: 'What is the meaning of life?',
    });

    console.log(response.embeddings);
}

main();