import { NextRequest, NextResponse } from 'next/server'
import { client, addReviewToDB, generateEmbedding, compareReviews, queryDB, MovieReview } from '../../../MindUtils'

export async function POST(request: NextRequest) {
  try {
    const { userName, movie, review, rating } = await request.json()

    if (!movie || !review || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Connect to database
    await client.connect()

    try {
      // Generate embedding for the review
      const embedding = await generateEmbedding(review)

      // Create the movie review object
      const movieReview: MovieReview = {
        title: movie,
        author: userName,
        stars: rating,
        review: review,
        embedding: embedding
      }

      // Add review to database
      await addReviewToDB(movieReview)

      // Query for similar reviews
      const results = await queryDB(embedding, movie, userName)

      if (results && results.length > 0) {
        // Get explanation for the recommendation
        const explanation = await compareReviews(movieReview, results[0])

        return NextResponse.json({
          recommendation: {
            title: results[0].title,
            author: results[0].author,
            stars: results[0].stars,
            review: results[0].review,
            score: results[0].score,
            explanation: explanation || 'No explanation available'
          }
        })
      } else {
        return NextResponse.json({
          recommendation: {
            title: movie,
            author: userName,
            stars: rating,
            review: review,
            score: 0,
            explanation: 'No similar reviews found. Your review has been added to our database for future recommendations.'
          }
        })
      }
    } finally {
      // Close database connection
      await client.close()
    }
  } catch (error) {
    console.error('Error in analyze API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
