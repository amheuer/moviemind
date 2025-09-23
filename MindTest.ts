import 'dotenv/config';
import { client, addReviewToDB, generateEmbedding, compareReviews, queryDB, MovieReview } from './MindUtils.js';

export async function main(): Promise<void> {
    await client.connect();
    try {
        const text = 'This is a terrible movie because james bond has sex and kills people and I hate both of those things. It is crude, violent and I don\'t like it.';
        const title = 'James Bond'
        const author = 'user'
        const stars = 1
        const embed = await generateEmbedding(text);
        const userInput: MovieReview = {
            title: title,
            author: author,
            stars: stars,
            review: text,
            embedding: embed
        }
        const results = await queryDB(userInput);
        await addReviewToDB(userInput);
        if (results && results.length > 0) {
            const response = await compareReviews(userInput, results[0]);
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
