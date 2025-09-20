import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange?: (val: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  className?: string;
  id?: string;
};

const sizes = { sm: 16, md: 22, lg: 28 } as const;

export function RatingStars({ value, onChange, size = "md", readOnly, className, id }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const s = sizes[size];
  const current = hover ?? value;

  return (
    <div
      id={id}
      role={readOnly ? undefined : "slider"}
      aria-label={readOnly ? undefined : "rating"}
      aria-valuemin={readOnly ? undefined : 0}
      aria-valuemax={readOnly ? undefined : 5}
      aria-valuenow={readOnly ? undefined : current}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={(e) => {
        if (readOnly || !onChange) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(5, value + 1));
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(0, value - 1));
      }}
      className={cn("inline-flex items-center gap-1", className)}
    >
      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
        <button
          key={i}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(i)}
          onMouseLeave={() => !readOnly && setHover(null)}
          onFocus={() => !readOnly && setHover(i)}
          onBlur={() => !readOnly && setHover(null)}
          onClick={() => onChange?.(i)}
          className={cn(
            "relative grid place-items-center rounded-sm transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
          style={{ width: s + 6, height: s + 6 }}
          aria-label={`${i} star${i === 1 ? "" : "s"}`}
        >
          <svg
            width={s}
            height={s}
            viewBox="0 0 24 24"
            aria-hidden
            className={cn(
              i <= current
                ? "text-accent drop-shadow-[0_0_8px_hsl(var(--accent)/0.6)]"
                : "text-muted-foreground/40",
            )}
          >
            <path
              d="M12 3l2.69 5.45 6.01.87-4.35 4.24 1.03 5.99L12 16.9 6.62 19.55l1.03-5.99L3.3 9.32l6.01-.87L12 3z"
              fill="currentColor"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
