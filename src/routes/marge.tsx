

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Euro, Zap, Scale, TrendingUp } from "lucide-react";
import { LargeTitle } from "@/components/LargeTitle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prix")({
  component: PrixPage,
  validateSearch: (search: Record<string, unknown>): { p?: number } => {
    const p = Number(search["p"]);
    return Number.isFinite(p) && p > 0 ? { p: Math.round(p) } : {};
  },
  head: () => ({
    meta: [
      { title: "Prix de vente — ResellBoost AI" },
      { name: "description", content: "Fixe le bon prix de vente Vinted : vente rapide, prix du marché ou prix fort. Sur Vinted, tu reçois 100 % du prix affiché." },
      { property: "og:title", content: "Prix de vente — ResellBoost AI" },
      { property: "og:description", content: "Trois stratégies de prix Vinted en un geste : rapide, moyen ou fort." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Strategy = "quick" | "mid" | "max";

const strategies: { key: Strategy; label: string; hint: string; factor: number; icon: typeof Zap }[] = [
  { key: "quick", label: "Vente rapide", hint: "-15 %", factor: 0.85, icon: Zap },
  { key: "mid", label: "Prix du marché", hint: "référence", factor: 1, icon: Scale },
  { key: "max", label: "Prix fort", hint: "+15 %", factor: 1.15, icon: TrendingUp },
];

function PrixPage() {
  const { p } = Route.useSearch();
  
  // L'ancre de référence (le prix généré par l'IA ou 20 par défaut).
  // Elle ne bouge JAMAIS quand on clique sur les pourcentages.
  const [anchorPrice, setAnchorPrice] = useState(p && p > 0 ? p : 20);
  
  // Le prix final affiché à l'écran.
  const [displayPrice, setDisplayPrice] = useState(String(anchorPrice));
  const [active, setActive] = useState<Strategy | null>(p ? "mid" : "mid");

  const applyStrategy = (factor: number, key: Strategy) => {
    // Le calcul se fait TOUJOURS depuis l'ancre fixe, empêchant le cumul des pourcentages.
    const nextPrice = Math.max(1, Math.round(anchorPrice * factor));
    setDisplayPrice(String(nextPrice));
    setActive(key);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplayPrice(val);
    setActive(null);
    
    const num = parseFloat(val);
    // Si l'utilisateur tape manuellement un prix valide, ce prix devient la NOUVELLE ancre.
    if (Number.isFinite(num) && num > 0) {
      setAnchorPrice(num);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 pb-32">
      <LargeTitle title="Prix" subtitle="Choisis ta stratégie de vente." />

      <div className="grid grid-cols-3 gap-2">
        {strategies.map(({ key, label, hint, factor, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => applyStrategy(factor, key)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl p-3 text-center shadow-ios transition active:scale-[0.97]",
              active === key ? "bg-primary text-primary-foreground shadow-cta" : "bg-card text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4", active === key ? "text-primary-foreground" : "text-primary")} />
            <span className="text-[12px] font-semibold leading-tight">{label}</span>
            <span className={cn("text-[11px]", active === key ? "text-primary-foreground/75" : "text-muted-foreground")}>
              {hint}
            </span>
          </button>
        ))}
      </div>

      <section className="mt-4 rounded-3xl bg-gradient-to-b from-accent/70 to-card p-6 text-center shadow-ios ring-1 ring-primary/10">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
          Prix de vente
        </p>
        <label className="mt-2 flex items-baseline justify-center gap-1.5">
          <input
            inputMode="decimal"
            value={displayPrice}
            onChange={handleManualInput}
            style={{ width: `${Math.max(1, displayPrice.length) + 0.4}ch` }}
            className="max-w-[60%] bg-transparent text-center text-[64px] font-bold leading-none tracking-tighter text-foreground outline-none tabular-nums"
            aria-label="Prix de vente en euros"
          />
          <span className="flex items-center text-3xl font-semibold text-primary">
            <Euro className="h-8 w-8" strokeWidth={2.4} />
          </span>
        </label>
        <p className="mt-3 text-[12px] text-muted-foreground">
          Touche une stratégie ci-dessus pour ajuster ce prix instantanément, ou saisis-le directement.
        </p>
      </section>

      <section className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800 shadow-ios">
        <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-[14px] font-medium leading-snug">
          Sur Vinted, tu reçois 100 % du prix affiché.
        </p>
      </section>
    </main>
  );
}