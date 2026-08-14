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
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <ul className="mx-auto flex max-w-lg items-stretch">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ "data-active": "true" }}
              className="flex flex-col items-center gap-1 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 text-[11px] font-medium text-muted-foreground transition-colors data-[active=true]:text-primary"
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
