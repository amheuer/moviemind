import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] grid-glow relative">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="group inline-flex items-center gap-2">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary/60 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
              <span className="absolute inset-0 rounded-md bg-primary/15 blur-[2px]" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative">
                <path d="M12 3l3.09 6.26L22 10.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 15.15l-5-4.88 6.91-1.01L12 3z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <span className={cn("brand-title text-xl font-semibold tracking-[0.12em] uppercase neon-text", pathname === "/" && "")}>moviemind</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className={cn("hover:text-primary transition-colors", pathname === "/" && "text-primary")}>Home</Link>
            <a href="https://builder.io/c/docs/projects" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Docs</a>
          </nav>
        </div>
      </header>

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 scanlines" />
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-background/70">
        <div className="container py-6 text-xs text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} moviemind</p>
          <p className="opacity-80">Retro‑futurism meets movie magic</p>
        </div>
      </footer>
    </div>
  );
}
