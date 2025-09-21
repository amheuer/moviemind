import 'dotenv/config';
import { client, addReviewToDB, generateEmbedding, compareReviews, queryDB, MovieReview } from './MindUtils.js';

export async function main(): Promise<void> {
    await client.connect();
    try {
        const text = 'Masterfully constructed and thoroughly compelling genre piece (effortlessly transitioning between familial drama, heist movie, satirical farce, subterranean horror) about the perverse and mutating symbiotic relationship of increasingly unequal, transactional class relationships, and who can and can\'t afford to be oblivious about the severe, violent material/psychic toll of capitalist accumulation. ("They say a ghost in the house brings wealth.") I think I ultimately admired this more than I felt it, it\'s clever and manufactured in a way that feels shiny and surface-level more than personal but I think it works in a movie in part about how those shiny surfaces distract us from the horrifying conditions that exist in order to sustain them. The seams of this system are ripping and it feels like Bong has channeled those economic precarities, indignities and anxieties into his own Rube Goldberg microcosm that asks how anyone could be surprised by a violent destination.';
        const title = 'Parasite'
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
