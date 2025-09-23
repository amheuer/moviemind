"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, Terminal, Brain, ChevronRight, Code, Cpu, Activity, Zap, Database, Loader2 } from "lucide-react"
import { DateTime } from 'luxon';


export default function MovieMind() {
  const [userName, setUserName] = useState("")
  const [movie, setMovie] = useState("")
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const MIN_REVIEW_LENGTH = 150;
  const MAX_REVIEW_LENGTH = 500;
  const lengthValid = review.length >= MIN_REVIEW_LENGTH && review.length <= MAX_REVIEW_LENGTH;
  const charactersTyped = review.length;
  const [recommendation, setRecommendation] = useState<{
    title: string
    author: string
    stars: number
    review: string
    score: number
    explanation: string
  } | null>(null)

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (movie && review && rating > 0) {
      setIsLoading(true)
      setError("")
      setRecommendation(null)

      try {
        // Call the API endpoint that will use MindUtils functions
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: userName || 'user',
            movie,
            review,
            rating
          })
        })

        if (!response.ok) {
          throw new Error('Failed to analyze review')
        }

        const data = await response.json()
        setRecommendation(data.recommendation)
        setIsSubmitted(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error analyzing review:', err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setUserName("")
    setMovie("")
    setReview("")
    setRating(0)
    setIsLoading(false)
    setError("")
    setRecommendation(null)
  }

  const formatted = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');


  if (isSubmitted) {
    return (
      <div className="min-h-screen neural-grid scanlines">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
              <Database className="w-12 h-12 text-primary terminal-glow-filter" />
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-primary terminal-glow tracking-wider manrope-heading text-balance">
                MovieMind
              </h1>
              <Zap className="w-10 h-10 text-primary terminal-glow-filter" />
            </div>
            <div className="space-y-3 max-w-3xl mx-auto px-3">
              <p className="text-base sm:text-xl font-mono terminal-command text-balance break-words hyphens-auto">
                $ ./neural_analysis.exe --status=COMPLETE
              </p>
              <p className="text-sm sm:text-base font-mono text-muted-foreground text-pretty">
                // A movie has been chosen based on another user's review
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono">
                <span className="status-indicator status-active">
                  <Activity className="w-3 h-3" />
                  ANALYSIS: COMPLETE
                </span>
                <span className="status-indicator status-processing">
                  <Cpu className="w-3 h-3" />
                  REVIEW: SELECTED
                </span>
                <span className="status-indicator">
                  <Terminal className="w-3 h-3" />
                  CONFIDENCE: HIGH
                </span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
                <span className="text-white font-mono text-sm ml-3 truncate max-w-[50%] no-min-w">recommender_review_data.txt</span>
                <div className="ml-auto flex items-center gap-3 shrink-0">
                  <span className="status-indicator">
                    <Code className="w-3 h-3" />
                    READ-ONLY
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 min-w-0">
                  <span className="terminal-prompt font-mono text-lg">{userName || 'user'}@moviemind:~$</span>
                  <span className="terminal-command font-mono text-base sm:text-lg break-words hyphens-auto text-balance no-min-w max-w-full">recommended_review_data.txt</span>
                </div>
                <div className="bg-black/50 p-6 rounded-lg border border-primary/30 ml-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold terminal-output terminal-glow mb-4 text-balance break-words hyphens-auto max-w-full">
                    {recommendation?.title || "No title found"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-7 h-7 ${star <= (recommendation?.stars || 5) ? "fill-primary text-primary terminal-glow" : "text-muted-foreground"}`}
                      />
                    ))}
                    <span className="sm:ml-4 ml-2 text-lg sm:text-xl font-mono terminal-output">
                      [{recommendation?.stars || 5}.0/5.0]
                    </span>
                    <span className="sm:ml-4 ml-2 text-xs sm:text-sm font-mono text-accent terminal-output inline-flex items-center leading-none tracking-normal">
                      {recommendation ? `${Math.round((recommendation.score || 0) * 100)}% MATCH` : 'ANALYSIS COMPLETE'}
                    </span>
                  </div>
                  <div className="border-t  mt-6 border-primary/20 pt-6">
                    <div className="font-mono text-sm terminal-prompt mb-4">
                      # USER REVIEW DATA - SIMILARITY ANALYSIS READY
                    </div>
                    <blockquote className="text-foreground font-mono leading-relaxed text-sm sm:text-base border-l-4 border-primary pl-4 break-words hyphens-auto text-pretty">
                      "{recommendation?.review}"
                    </blockquote>
                    <div className="font-mono text-xs sm:text-sm terminal-output mt-4 flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className="break-words hyphens-auto"># ANALYSIS: {recommendation?.review.length} characters processed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: '5x' }} /> {/* spacer with 5px height */}


            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
                <span className="text-white font-mono text-sm ml-3 truncate max-w-[50%] no-min-w">neural_similarity_analysis.log</span>
                <div className="ml-auto flex items-center gap-3 shrink-0">
                  <span className="status-indicator status-processing">
                    <Brain className="w-3 h-3 animate-pulse" />
                    AI ANALYSIS
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 min-w-0">
                  <span className="terminal-prompt font-mono text-lg">{userName || 'user'}@moviemind:~$</span>
                  <span className="terminal-command font-mono text-base sm:text-lg break-words hyphens-auto text-balance no-min-w max-w-full">neural_similarity_analysis.log</span>
                </div>
                <div className="bg-black/50 p-6 rounded-lg border border-primary/30 ml-6 space-y-4">
                  <div className="space-y-2 text-xs sm:text-sm font-mono">
                    <p className="break-words hyphens-auto text-pretty">
                      <span className="terminal-prompt">[{formatted}]</span>{" "}
                      <span className="terminal-command">[INIT]</span> Loading neural network model v2.1.0...
                    </p>
                    <p className="break-words hyphens-auto text-pretty">
                      <span className="terminal-prompt">[{formatted}]</span>{" "}
                      <span className="terminal-command">[PROC]</span> Analyzing sentiment patterns and thematic
                      elements...
                    </p>
                    <p className="break-words hyphens-auto text-pretty">
                      <span className="terminal-prompt">[{formatted}]</span>{" "}
                      <span className="terminal-output">[MATCH]</span> SIMILARITY_DETECTED: {Math.round((recommendation?.score || 0) * 100)}% confidence level
                    </p>
                    <p className="break-words hyphens-auto text-pretty">
                      <span className="terminal-prompt">[{formatted}]</span>{" "}
                      <span className="terminal-output">[DONE]</span> Analysis complete. Generating explanation...
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-primary/20">
                    <div className="font-mono text-sm terminal-command mb-4"># NEURAL SIMILARITY ANALYSIS REPORT</div>
                    <div className="bg-black/30 p-4 rounded border border-accent/20">
                      <p className="text-foreground font-mono leading-relaxed text-sm sm:text-base break-words hyphens-auto text-pretty">
                        {recommendation?.explanation || `Your review of ${movie} has been analyzed by our neural network. The system has identified patterns in your preferences and generated a personalized recommendation based on similar user experiences and sentiment analysis.`}
                      </p>
                    </div>
                    <div className="font-mono text-xs sm:text-sm terminal-output mt-4 flex flex-wrap items-center gap-3 sm:gap-6">
                      <span className="break-words hyphens-auto"># Correlation coefficient: {Math.round((recommendation?.score || 0) * 100)}</span>
                      <span className="break-words hyphens-auto"># Confidence: HIGH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button onClick={handleReset} className="terminal-button px-8 py-4">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-accent" />
                <span className="text-center leading-tight text-accent">$ ./new_analysis.exe</span>
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-accent" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen neural-grid scanlines">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-primary terminal-glow-filter" />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary terminal-glow tracking-wider manrope-heading">
              MovieMind
            </h1>
            <Cpu className="w-8 h-8 sm:w-12 sm:h-12 text-primary terminal-glow-filter " />
          </div>
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto px-2">
            <p className="text-base sm:text-xl font-mono terminal-command text-balance break-words hyphens-auto no-min-w max-w-full text-center">
              $ ./neural_recommendation_engine.exe
            </p>
            <p className="text-sm sm:text-base font-mono text-muted-foreground text-pretty">
              // The only recommendation algorithm powered by actual intelligence
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono">
              <span className="status-indicator status-active">
                <Activity className="w-3 h-3" />
                <span className="hidden xs:inline">SYSTEM: </span>MOVIE REVIEW DATABASE
              </span>
              <span className="status-indicator status-processing">
                <Database className="w-3 h-3" />
                <span className="hidden xs:inline">DATABASE: </span>AI POWERED ENGINE
              </span>
              <span className="status-indicator">
                <Brain className="w-3 h-3" />
                <span className="hidden xs:inline">AI: </span>HUMAN RECOMMENDATIONS
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
              <span className="text-c9b3ff font-mono text-sm ml-2 sm:ml-3 truncate">moviemind.exe</span>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <span className="status-indicator status-active">
                  <Terminal className="w-3 h-3" />
                  <span className="hidden sm:inline">INTERACTIVE </span>MODE
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <span className="terminal-prompt font-mono text-base sm:text-lg">{userName || 'user'}@moviemind:~$</span>
                  <span className="terminal-command font-mono text-sm sm:text-lg text-balance break-words hyphens-auto no-min-w max-w-full">
                    ./input_review_data
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4 ml-4 sm:ml-8">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 terminal-command" />
                      <label className="font-mono text-accent text-sm sm:text-lg terminal-command"># user_name:</label>
                    </div>
                    <Input
                      type="text"
                      placeholder="> Enter your name..."
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-input border-border font-mono placeholder:text-muted-foreground placeholder:opacity-50 text-foreground terminal-input text-base sm:text-lg py-2 sm:py-3"
                    />
                    {userName && (
                      <div className="font-mono text-sm terminal-output mt-2">
                        # Welcome, {userName}! Neural analysis ready.
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 terminal-command" />
                    <label className="font-mono text-accent text-sm sm:text-lg terminal-command"># movie_title:</label>
                  </div>
                  <Input
                    type="text"
                    placeholder="> Enter the title of a movie you want a recommendation based on..."
                    value={movie}
                    onChange={(e) => setMovie(e.target.value)}
                    className="bg-input border-border font-mono placeholder:text-muted-foreground placeholder:opacity-50 terminal-input text-base sm:text-lg py-2 sm:py-3"
                    required
                  />
                </div>

                <div className="space-y-3 sm:space-y-4 ml-4 sm:ml-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 terminal-command" />
                    <label className="font-mono text-accent text-sm sm:text-lg terminal-command"># user_review:</label>
                  </div>
                  <Textarea
                    placeholder="> Write a detailed review of the movie. The more information you can provide about why specifically you like it, the better our recommendation will be..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="bg-input border-border font-mono placeholder:text-muted-foreground placeholder:opacity-50 min-h-[120px] sm:min-h-[200px] terminal-input text-sm sm:text-base leading-relaxed"
                    required
                    minLength={MIN_REVIEW_LENGTH}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span className="sr-only">Character count</span>
                    <span aria-live="polite" className="ml-auto">{charactersTyped}/{MAX_REVIEW_LENGTH}</span>
                  </div>
                  {!lengthValid && review.length < MIN_REVIEW_LENGTH && (
                    <p className="text-red-500 text-sm mt-1">
                      Review must be at least {MIN_REVIEW_LENGTH} characters. [{charactersTyped}/{MIN_REVIEW_LENGTH}]
                    </p>
                  )}
                  {!lengthValid && review.length > MAX_REVIEW_LENGTH && (
                    <p className="text-red-500 text-sm mt-1">
                      Review must be less than {MAX_REVIEW_LENGTH} characters. [{charactersTyped}/{MAX_REVIEW_LENGTH}]
                    </p>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4 ml-4 sm:ml-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 terminal-command" />
                    <label className="font-mono text-accent text-sm sm:text-lg terminal-command"># rating_score:</label>
                  </div>
                  <div className="flex items-center justify-start gap-3 sm:gap-4 flex-wrap relative z-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        aria-pressed={rating >= star}
                        className="transition-all hover:scale-110 focus:scale-110 touch-manipulation p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${star <= rating
                            ? "fill-primary text-primary terminal-glow"
                            : "text-muted-foreground hover:text-primary/50"
                            }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 sm:ml-4 text-lg sm:text-xl font-mono terminal-output">
                        [{rating}.0/5.0]
                      </span>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
                    <div className="font-mono text-red-400 text-sm">
                      # ERROR: {error}
                    </div>
                  </div>
                )}

                <div className="pt-6 sm:pt-8">
                  <Button
                    type="submit"
                    className="w-full terminal-button"
                    disabled={!movie || !review || rating === 0 || !userName || !lengthValid || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 animate-spin" />
                    ) : (null)}
                    <span className="text-center leading-tight text-accent break-words hyphens-auto no-min-w max-w-full">
                      {isLoading ? (
                        "$ ./neural_analysis.exe --processing..."
                      ) : (
                        <>
                          $ ./execute_neural_recommendation_engine.exe
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 sm:mt-16 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-muted-foreground">
            <span className="flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Vector Embedding Powered by Google Gemini
            </span>
            <span className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              Generative AI Powered by Cerberas
            </span>
            <span className="flex items-center gap-2">
              <Database className="w-3 h-3" />
              Database Powered by MongoDB
            </span>
          </div>
          <p className="text-xs font-mono terminal-output px-4 text-balance">
            // Built by Andrew Heuer and Nikhil Krishna for PennApps XXVI
          </p>
        </div>
      </div>
    </div>
  )
}
