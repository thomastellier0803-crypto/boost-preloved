import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function AppHeader({
  title,
  subtitle,
  credits,
}: {
  title: string;
  subtitle?: string;
  credits?: { used: number; quota: number };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="app-container flex items-center justify-between gap-3 py-3.5">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {credits ? (
          <Link
            to="/pro"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground shadow-card transition-transform active:scale-95"
          >
            <Zap className="size-3.5 text-primary" strokeWidth={2.25} />
            {Math.max(0, credits.quota - credits.used)} / {credits.quota}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
