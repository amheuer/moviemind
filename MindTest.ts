import 'dotenv/config';
import { client, addReviewToDB, generateEmbedding, compareReviews, queryDB, MovieReview } from './MindUtils.js';

export async function main(): Promise<void> {
    await client.connect();
    try {
        const text = 'By and large, it’s at least a solid movie, but it’s hard to not feel immensely disappointed. It moves insanely fast, sacrificing any ounce of storytelling in favor of Easter eggs, gags, and nostalgia.It’s kind of shocking how little time the movie spends trying to make us care about these worlds or characters and it doesn’t help that beside Jack Black(the easy MVP), everyone else seems to phone it in.  But even if it flounders at the basic foundation, it’s still fun ? Looks good, some of the jokes hit well, and I enjoyed a lot of the action sequences.There’s a particular nihilistic side character that had me in stitches. Am I blinded by own adoration for the Mario Brothers franchise ? Likely.But presumably that’s going to be the case for 90 % of the people who will see it this';
        const title = 'The Super Mario Bros. Movie'
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
