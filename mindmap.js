import 'dotenv/config';
import { client, addReviewToDB, generateEmbedding, compareReviews, queryDB } from './mindUtils.js';

export async function main() {
    await client.connect();
    try {
        const text = 'FLINT AND STEEL CHICKEN JOCKEY THE NETHER AN ENDER PEARL I AM STEVE.';
        const title = 'A Minecraft Movie'
        const author = 'user'
        const stars = 5
        const embed = await generateEmbedding(text);
        const item = {
            title: title,
            author: author,
            stars: stars,
            review: text,
            embedding: embed

        }
        const results = await queryDB(embed, title, author);
        await addReviewToDB(item);
        const response = await compareReviews(item, results?.[0]);
        console.log(response);
    } finally {
        await client.close();
    }
}

main().catch(err => {
    console.error(err);
});