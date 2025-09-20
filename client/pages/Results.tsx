import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/RatingStars";

export default function Results() {
  const nav = useNavigate();
  const loc = useLocation() as any;

  const payload = (loc.state as Payload | undefined) ?? loadFromStorage();

  useEffect(() => {
    if (!payload) nav("/", { replace: true });
  }, [payload, nav]);

  if (!payload) return null;

  const { input, output } = payload;
  const { recommended, explanation } = output;

  return (
    <div className="container py-8 md:py-12">
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="brand-title text-2xl">
              We recommend
              <span className="ml-2 text-primary">{recommended.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-3">
              <RatingStars value={recommended.rating} readOnly size="lg" />
              <span className="text-sm text-muted-foreground">{recommended.rating} / 5 stars</span>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Another user's review</h3>
              <p className="mt-2 leading-relaxed text-foreground/90">{recommended.review}</p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/70 p-4">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Why moviemind chose this</h3>
              <p className="mt-2 text-foreground/90">{explanation}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="brand-title text-xl">Your input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground">Movie</h4>
              <p className="mt-1">{input.title}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground">Your review</h4>
              <p className="mt-1 leading-relaxed text-foreground/90">{input.review}</p>
            </div>
            <div className="flex items-center gap-3">
              <RatingStars value={input.rating} readOnly />
              <span className="text-xs text-muted-foreground">{input.rating} / 5 stars</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function loadFromStorage(): Payload | undefined {
  try {
    const raw = sessionStorage.getItem("moviemind:last");
    if (!raw) return undefined;
    return JSON.parse(raw) as Payload;
  } catch {
    return undefined;
  }
}

type Payload = {
  input: { title: string; review: string; rating: number };
  output: {
    recommended: { title: string; rating: number; review: string };
    explanation: string;
  };
};
