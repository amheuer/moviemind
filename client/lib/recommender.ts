export type SampleReview = {
  title: string;
  rating: number; // 0-5
  review: string;
  tags: string[];
};

const SAMPLE_DATA: SampleReview[] = [
  {
    title: "Blade Runner 2049",
    rating: 5,
    review:
      "Haunting neo-noir soaked in synths and neon. Meditative pacing, questions about identity and humanity, breathtaking visuals.",
    tags: ["sci-fi", "neo-noir", "identity", "visuals", "slow-burn", "dystopia"],
  },
  {
    title: "The Matrix",
    rating: 5,
    review:
      "Philosophical cyberpunk action with bullet-time, hacker vibe, and mind-bending reality questions.",
    tags: ["sci-fi", "cyberpunk", "action", "philosophy", "ai", "reality"],
  },
  {
    title: "Her",
    rating: 4,
    review:
      "Tender near-future romance about connection and isolation. Subtle, warm, and introspective.",
    tags: ["sci-fi", "romance", "introspective", "ai", "character-study"],
  },
  {
    title: "Mad Max: Fury Road",
    rating: 5,
    review:
      "Relentless dieselpunk chase with practical stunts, stunning color, and a propulsive score.",
    tags: ["action", "post-apocalyptic", "visuals", "stunts", "score", "fast-paced"],
  },
  {
    title: "The Grand Budapest Hotel",
    rating: 4,
    review:
      "Whimsical, meticulous production design and bittersweet humor in a charming caper.",
    tags: ["comedy", "visuals", "whimsical", "ensemble", "production-design"],
  },
  {
    title: "Arrival",
    rating: 5,
    review:
      "Quiet, cerebral sci‑fi about language and time. Thoughtful tone, emotional core, and resonant score.",
    tags: ["sci-fi", "language", "time", "introspective", "slow-burn", "emotional"],
  },
  {
    title: "Ex Machina",
    rating: 4,
    review:
      "Taut, intimate thriller about AI, power, and manipulation. Minimalist design and eerie tension.",
    tags: ["sci-fi", "ai", "thriller", "minimalist", "tense"],
  },
  {
    title: "Knives Out",
    rating: 4,
    review:
      "Clever whodunit with sharp humor, character dynamics, and cozy mystery vibes.",
    tags: ["mystery", "ensemble", "comedy", "clever", "whodunit"],
  },
  {
    title: "The Social Network",
    rating: 4,
    review:
      "Razor-sharp drama with propulsive editing and an icy electronic score about ambition and friendship.",
    tags: ["drama", "ambition", "score", "dialogue", "biopic"],
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    rating: 5,
    review:
      "Inventive animation, kinetic energy, and heartfelt story about identity and found family.",
    tags: ["animation", "superhero", "visuals", "heartfelt", "identity"],
  },
];

const STOPWORDS = new Set(
  "a,an,and,or,of,the,is,are,was,were,be,been,being,to,in,on,for,with,as,by,about,into,at,from,this,that,these,those,it,its,his,her,him,she,he,they,them,we,us,you,your,yours,our,ours,not,no,so,if,than,then,too,very,really,just".split(","),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));
}

function scoreOverlap(a: string[], b: string[]): number {
  const setB = new Set(b);
  let match = 0;
  for (const w of a) if (setB.has(w)) match++;
  return match / Math.max(1, a.length);
}

function rateDistance(userRating: number, candidateRating: number): number {
  const diff = Math.abs(userRating - candidateRating);
  return 1 - diff / 5; // closer is better
}

export type UserInput = { title: string; review: string; rating: number };
export type Recommendation = {
  recommended: SampleReview;
  explanation: string;
};

export function recommend(input: UserInput): Recommendation {
  const words = tokenize(input.title + " " + input.review);
  const guessGenreHints = words.filter((w) =>
    [
      "sci",
      "cyberpunk",
      "noir",
      "romance",
      "action",
      "thriller",
      "mystery",
      "animation",
      "drama",
      "apocalyptic",
      "dystopia",
      "ai",
      "language",
      "time",
      "visuals",
      "score",
      "identity",
    ].some((k) => w.startsWith(k)),
  );

  let best = SAMPLE_DATA[0];
  let bestScore = -Infinity;

  for (const item of SAMPLE_DATA) {
    const textTokens = tokenize(item.review).concat(item.tags);
    const overlap = scoreOverlap(words, textTokens);
    const ratingAffinity = rateDistance(input.rating, item.rating);
    // weight text (0.7) + rating (0.3)
    const total = overlap * 0.7 + ratingAffinity * 0.3;
    if (total > bestScore) {
      bestScore = total;
      best = item;
    }
  }

  const overlapWords = new Set(
    tokenize(best.review)
      .concat(best.tags)
      .filter((w) => words.includes(w))
      .slice(0, 5),
  );

  const reasons: string[] = [];
  if (overlapWords.size > 0)
    reasons.push(
      `both emphasize ${Array.from(overlapWords)
        .slice(0, 3)
        .join(", ")}`,
    );
  if (guessGenreHints.length) reasons.push("similar themes");
  if (Math.abs(input.rating - best.rating) <= 1)
    reasons.push("a matching vibe in rating and tone");

  const explanation = `Recommended because ${
    reasons.length ? reasons.join(" and ") : "it shares tone and mood"
  }. We picked \"${best.title}\" based on the keywords in your review and overall feel.`;

  return { recommended: best, explanation };
}
