import { Link } from "@tanstack/react-router";
import { Camera, History, Calculator, Sparkles, Settings } from "lucide-react";

const items = [
  { to: "/", label: "Scanner", icon: Camera },
  { to: "/historique", label: "Historique", icon: History },
  { to: "/marge", label: "Marge", icon: Calculator },
  { to: "/pro", label: "Pro", icon: Sparkles },
  { to: "/reglages", label: "Réglages", icon: Settings },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/80 backdrop-blur-xl">
      <ul className="mx-auto grid max-w-lg grid-cols-5 items-stretch">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ "data-active": "true" }}
              className="group flex h-full flex-col items-center justify-center gap-1 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-[10px] font-medium text-muted-foreground transition-colors data-[active=true]:text-primary"
            >
              <span className="flex h-8 w-12 items-center justify-center rounded-full transition-all group-data-[active=true]:bg-accent">
                <Icon className="size-5 transition-transform group-data-[active=true]:scale-110" strokeWidth={1.9} />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
