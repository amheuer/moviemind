# MovieMind

The recommendation engine powered by actual intelligence. Movie suggestions based on people liking movies for the same reasons you do. Driven by a vector database of reviews and semantic similarity.

## Features:
- Vector embeddings with Google Gemini
- Vector Database with MongoDB
- Summaries given with Cerebras
- Movie Dataset from TMDB
- DataLoader with ability to parse through TMDB API and batch export

## Environment Variables:
- TMDB_API_KEY
- MONGO_USERNAME
- MONGO_PASSWORD
- GOOGLE_PROJ_ID
- GEMINI_API_KEY
- CEREBRAS_API_KEY

## Run a development server
```bash
npm run dev
```
## Make a build
```bash
npm run build
```
## Run the linter
```bash
npm run lint
```
## Launch for production
```bash
npm run start
```
## Run individual typescript files
```bash
tsx filename.ts
```
  
 