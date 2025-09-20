import 'dotenv/config';
import { client, addReviewToDB, generateEmbedding, compareReviews, queryDB, MovieReview } from './MindUtils';

export async function main(): Promise<void> {
    await client.connect();
    try {
        const text = 'FLINT AND STEEL CHICKEN JOCKEY THE NETHER AN ENDER PEARL I AM STEVE.';
        const title = 'A Minecraft Movie'
        const author = 'user'
        const stars = 5
        const embed = await generateEmbedding(text);
        const item: MovieReview = {
            title: title,
            author: author,
            stars: stars,
            review: text,
            embedding: embed
        }
        const results = await queryDB(embed, title, author);
        await addReviewToDB(item);
        if (results && results.length > 0) {
            const response = await compareReviews(item, results[0]);
            console.log(response);
        } else {
            console.log('No similar reviews found');
        }
    } finally {
        await client.close();
    }
}

main().catch(err => {
    console.error(err);
});
