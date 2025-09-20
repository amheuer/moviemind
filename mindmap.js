import 'dotenv/config';
import { client, addReviewToDB, generateEmbedding, compareReviews, queryDB } from './mindUtils.js';

export async function main() {
    await client.connect();
    try {
        const text = 'I really like the martian because it a very funny movie that also has good dramatic elements. I like that it is set in space and that it is about humanity overcoming challenges from space travel. I also like the book it was based on. ';
        const title = 'The Martian'
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