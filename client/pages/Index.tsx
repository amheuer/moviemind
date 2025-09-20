import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/RatingStars";
import { recommend } from "@/lib/recommender";

export default function Index() {
  const nav = useNavigate();
  const [movie, setMovie] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number>(4);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!movie.trim() || !review.trim()) {
      setError("Please enter a movie name and your review.");
      return;
    }
    const rec = recommend({ title: movie, review, rating });
    const payload = {
      input: { title: movie, review, rating },
      output: rec,
    };
    sessionStorage.setItem("moviemind:last", JSON.stringify(payload));
    nav("/results", { state: payload });
  }

  return (
    <div className="relative">
      <section className="container py-10 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <h1 className="brand-title neon-text text-4xl leading-tight md:text-5xl">
              Find your next favorite film
              <span className="block text-primary">with moviemind</span>
            </h1>
            <p className="text-muted-foreground max-w-prose">
              Tell us a movie you love, why you love it, and how many stars you give it. We’ll recommend another movie loved for similar reasons, plus explain the connection.
            </p>
          </div>
          <Card className="glass relative overflow-hidden">
            <CardHeader>
              <CardTitle className="brand-title text-xl">Tell moviemind what you like</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="movie" className="text-sm text-muted-foreground">Movie you like</label>
                  <Input
                    id="movie"
                    value={movie}
                    onChange={(e) => setMovie(e.target.value)}
                    placeholder="e.g. Blade Runner 2049"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="review" className="text-sm text-muted-foreground">Your review</label>
                  <Textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share what you loved: mood, themes, visuals, pacing..."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="rating" className="text-sm text-muted-foreground">Your rating</label>
                  <div className="flex items-center justify-between gap-3">
                    <RatingStars id="rating" value={rating} onChange={setRating} size="lg" />
                    <span className="text-xs text-muted-foreground">{rating} / 5 stars</span>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <div className="pt-2">
                  <Button type="submit" className="w-full md:w-auto">
                    Get recommendation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container pb-12 md:pb-20">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <BadgePill>retro</BadgePill>
          <BadgePill>futurism</BadgePill>
          <BadgePill>neo‑noir</BadgePill>
          <BadgePill>jetsons‑vibes</BadgePill>
        </div>
      </section>
    </div>
  );
}

function BadgePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
      {children}
    </div>
  );
}
