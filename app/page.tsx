"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, Terminal, Brain, ChevronRight, Code, Cpu, Activity, Zap, Database } from "@/components/icons"

export default function MovieMind() {
  const [movie, setMovie] = useState("")
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (movie && review && rating > 0) {
      setIsSubmitted(true)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setMovie("")
    setReview("")
    setRating(0)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen neural-grid scanlines">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
              <Database className="w-12 h-12 text-primary terminal-glow" />
              <h1 className="text-6xl font-bold text-primary terminal-glow tracking-wider">MovieMind</h1>
              <Zap className="w-10 h-10 text-accent terminal-glow" />
            </div>
            <div className="space-y-3 max-w-3xl mx-auto">
              <p className="text-xl font-mono terminal-command">
                $ ./neural_analysis.exe --status=COMPLETE --confidence=94.7% --runtime=0.847s
              </p>
              <p className="text-base font-mono text-muted-foreground">
                // Neural network analysis completed successfully
              </p>
              <div className="flex items-center justify-center gap-6 text-sm font-mono">
                <span className="status-indicator status-active">
                  <Activity className="w-3 h-3" />
                  ANALYSIS: COMPLETE
                </span>
                <span className="status-indicator status-processing">
                  <Cpu className="w-3 h-3" />
                  MEMORY: 1.2GB
                </span>
                <span className="status-indicator">
                  <Terminal className="w-3 h-3" />
                  PID: 2847
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
                <span className="text-white font-mono text-sm ml-3">neural_match_result.json</span>
                <div className="ml-auto flex items-center gap-3">
                  <span className="status-indicator status-active">
                    <Activity className="w-3 h-3" />
                    MATCH FOUND
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="terminal-prompt font-mono text-lg">user@moviemind:~$</span>
                  <span className="terminal-command font-mono text-lg">cat neural_match_result.json | jq '.'</span>
                </div>

                <div className="space-y-6 ml-6 bg-black/40 p-6 rounded-lg border border-primary/30">
                  <div className="font-mono text-sm terminal-output mb-4">
                    {"{"}
                    <br />
                    &nbsp;&nbsp;"match_found": <span className="text-green-400">true</span>,<br />
                    &nbsp;&nbsp;"confidence": <span className="text-cyan-400">0.947</span>,<br />
                    &nbsp;&nbsp;"movie_title": <span className="text-yellow-400">"The Matrix"</span>,<br />
                    &nbsp;&nbsp;"rating": <span className="text-cyan-400">5.0</span>,<br />
                    &nbsp;&nbsp;"similarity_score": <span className="text-cyan-400">94.7</span>
                    <br />
                    {"}"}
                  </div>

                  <div className="border-t border-primary/20 pt-6">
                    <h2 className="text-4xl font-bold terminal-output terminal-glow mb-4">The Matrix</h2>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-7 h-7 ${star <= 5 ? "fill-primary text-primary terminal-glow" : "text-muted-foreground"}`}
                        />
                      ))}
                      <span className="ml-4 text-xl font-mono terminal-output">[5.0/5.0]</span>
                      <span className="ml-4 text-sm font-mono text-accent">94.7% MATCH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
                <span className="text-white font-mono text-sm ml-3">user_review_data.txt</span>
                <div className="ml-auto flex items-center gap-3">
                  <span className="status-indicator">
                    <Code className="w-3 h-3" />
                    READ-ONLY
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="terminal-prompt font-mono text-lg">user@moviemind:~$</span>
                  <span className="terminal-command font-mono text-lg">cat user_review_data.txt</span>
                </div>
                <div className="bg-black/50 p-6 rounded-lg border border-primary/30 ml-6">
                  <div className="font-mono text-sm terminal-prompt mb-4">
                    # USER REVIEW DATA - SENTIMENT ANALYSIS READY
                  </div>
                  <blockquote className="text-foreground font-mono leading-relaxed text-base border-l-4 border-primary pl-4">
                    "Mind-bending sci-fi that completely changed how I think about reality. The philosophical depth
                    combined with incredible action sequences makes this a masterpiece. Keanu Reeves delivers an iconic
                    performance that defined a generation."
                  </blockquote>
                  <div className="font-mono text-sm terminal-output mt-4 flex items-center gap-4">
                    <span># ANALYSIS: 247 characters processed</span>
                    <span># SENTIMENT: HIGHLY_POSITIVE</span>
                    <span># KEYWORDS: 12 extracted</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
                <span className="text-white font-mono text-sm ml-3">neural_similarity_analysis.log</span>
                <div className="ml-auto flex items-center gap-3">
                  <span className="status-indicator status-processing">
                    <Brain className="w-3 h-3 animate-pulse" />
                    AI ANALYSIS
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="terminal-prompt font-mono text-lg">user@moviemind:~$</span>
                  <span className="terminal-command font-mono text-lg">tail -f neural_similarity_analysis.log</span>
                </div>
                <div className="bg-black/50 p-6 rounded-lg border border-primary/30 ml-6 space-y-4">
                  <div className="space-y-2 text-sm font-mono">
                    <p>
                      <span className="terminal-prompt">[2024-01-15 14:32:01]</span>{" "}
                      <span className="terminal-command">[INIT]</span> Loading neural network model v2.1.0...
                    </p>
                    <p>
                      <span className="terminal-prompt">[2024-01-15 14:32:02]</span>{" "}
                      <span className="terminal-command">[PROC]</span> Analyzing sentiment patterns and thematic
                      elements...
                    </p>
                    <p>
                      <span className="terminal-prompt">[2024-01-15 14:32:03]</span>{" "}
                      <span className="terminal-output">[MATCH]</span> SIMILARITY_DETECTED: 94.7% confidence level
                    </p>
                    <p>
                      <span className="terminal-prompt">[2024-01-15 14:32:04]</span>{" "}
                      <span className="terminal-output">[DONE]</span> Analysis complete. Generating explanation...
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-primary/20">
                    <div className="font-mono text-sm terminal-command mb-4"># NEURAL SIMILARITY ANALYSIS REPORT</div>
                    <div className="bg-black/30 p-4 rounded border border-accent/20">
                      <p className="text-foreground font-mono leading-relaxed">
                        Both films explore profound themes of reality manipulation and feature protagonists who must
                        question the nature of their perceived world. Your appreciation for{" "}
                        <span className="text-accent font-bold">{movie}</span>'s philosophical depth directly aligns
                        with The Matrix's exploration of simulated reality and existential questioning. The neural
                        network detected matching sentiment patterns in your review regarding mind-bending narratives,
                        transformative storytelling, and the impact of iconic performances that transcend their medium.
                      </p>
                    </div>
                    <div className="font-mono text-sm terminal-output mt-4 flex items-center gap-6">
                      <span># Correlation coefficient: 0.947</span>
                      <span># Processing time: 847ms</span>
                      <span># Confidence: HIGH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button onClick={handleReset} className="terminal-button px-8 py-4">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-center leading-tight">$ ./new_analysis.exe --reset</span>
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
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
            <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-primary terminal-glow" />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary terminal-glow tracking-wider">
              MovieMind
            </h1>
            <Cpu className="w-6 h-6 sm:w-10 sm:h-10 text-accent terminal-glow" />
          </div>
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto px-2">
            <p className="text-base sm:text-xl font-mono terminal-command text-balance">
              $ ./neural_recommendation_engine.exe --init --mode=interactive --verbose
            </p>
            <p className="text-sm sm:text-base font-mono text-muted-foreground text-pretty">
              // AI-powered movie recommendations based on neural sentiment analysis
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono">
              <span className="status-indicator status-active">
                <Activity className="w-3 h-3" />
                <span className="hidden xs:inline">SYSTEM: </span>READY
              </span>
              <span className="status-indicator status-processing">
                <Database className="w-3 h-3" />
                <span className="hidden xs:inline">DATABASE: </span>ONLINE
              </span>
              <span className="status-indicator">
                <Brain className="w-3 h-3" />
                <span className="hidden xs:inline">AI: </span>LOADED
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
              <span className="text-c9b3ff font-mono text-sm ml-2 sm:ml-3 truncate">movie_input_interface.exe</span>
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
                  <span className="terminal-prompt font-mono text-base sm:text-lg">user@moviemind:~$</span>
                  <span className="terminal-command font-mono text-sm sm:text-lg text-balance">
                    ./collect_movie_data --interactive --format=json
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4 ml-4 sm:ml-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                    <label className="font-mono text-accent text-sm sm:text-lg"># movie_title (string):</label>
                  </div>
                  <Input
                    type="text"
                    placeholder="> Enter the movie title you want to analyze..."
                    value={movie}
                    onChange={(e) => setMovie(e.target.value)}
                    className="bg-input border-border font-mono placeholder:text-muted-foreground/50 text-foreground terminal-input text-base sm:text-lg py-2 sm:py-3"
                    required
                  />
                </div>

                <div className="space-y-3 sm:space-y-4 ml-4 sm:ml-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                    <label className="font-mono text-accent text-sm sm:text-lg"># user_review (text):</label>
                  </div>
                  <Textarea
                    placeholder="> Share your detailed thoughts and feelings about this movie..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="bg-input border-border font-mono placeholder:text-muted-foreground/50 min-h-[120px] sm:min-h-[140px] text-foreground terminal-input text-sm sm:text-base leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-3 sm:space-y-4 ml-4 sm:ml-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                    <label className="font-mono text-accent text-sm sm:text-lg"># rating_score (int 1-5):</label>
                  </div>
                  <div className="flex items-center justify-start gap-3 sm:gap-4 flex-wrap">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="transition-all hover:scale-110 focus:scale-110 touch-manipulation p-1"
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

                <div className="pt-6 sm:pt-8">
                  <Button type="submit" className="w-full terminal-button" disabled={!movie || !review || rating === 0}>
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="text-center leading-tight text-accent">
                      $ ./execute_neural_analysis.exe
                      <br className="sm:hidden" />
                      <span className="hidden sm:inline"> </span>--process --generate-recommendation
                    </span>
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
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
              neural_network_v2.1.0
            </span>
            <span className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              uptime: 99.7%
            </span>
            <span className="flex items-center gap-2">
              <Database className="w-3 h-3" />
              memory: 1.2GB/4GB
            </span>
          </div>
          <p className="text-xs font-mono terminal-output px-4 text-balance">
            // system status: optimal | cpu usage: 12% | active connections: 1,247
          </p>
        </div>
      </div>
    </div>
  )
}
