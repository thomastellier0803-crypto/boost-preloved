import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Euro, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/marge")({
  head: () => ({
    meta: [
      { title: "Estimation de Prix — ResellBoost AI" },
      {
        name: "description",
        content:
          "Choisis ton prix de vente Vinted selon la vitesse souhaitée : vente rapide, prix moyen ou prix fort. Tu reçois 100 % du prix affiché.",
      },
      { property: "og:title", content: "Estimation de Prix — ResellBoost AI" },
      {
        property: "og:description",
        content: "Fixe le bon prix de vente sur Vinted en un geste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricePage,
});

const SPEED_PRESETS = [
  { key: "quick", label: "Vente rapide", price: "3" },
  { key: "avg", label: "Prix moyen", price: "5" },
  { key: "high", label: "Prix fort", price: "7" },
] as const;

function PricePage() {
  const [price, setPrice] = useState("");
  const num = Number.isFinite(parseFloat(price)) ? parseFloat(price) : 0;

  return (
    <div className="pb-6">
      <AppHeader title="Estimation de Prix" subtitle="Fixe le bon prix de vente" />
      <div className="app-container space-y-5 py-5">
        <div className="glass-card space-y-4 p-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Vitesse de vente
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SPEED_PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPrice(p.price)}
                  className={
                    price === p.price
                      ? "cta-glow rounded-2xl px-2 py-2.5 text-[11px] font-semibold leading-tight"
                      : "rounded-2xl border border-border bg-card px-2 py-2.5 text-[11px] font-medium leading-tight text-muted-foreground"
                  }
                >
                  {p.label}
                  <span className="mt-0.5 block text-sm font-bold">{p.price} €</span>
                </button>
              ))}
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Prix de vente (€)
            </span>
            <span className="relative block">
              <Euro className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" />
              <input
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(",", "."))}
                placeholder="0,00"
                className="h-14 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-lg font-semibold tracking-tight shadow-card outline-none transition-shadow focus:border-primary focus:shadow-glow"
              />
            </span>
          </label>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-6 text-center shadow-card"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.15 162), oklch(0.72 0.16 172))",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
            Tu reçois
          </p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-white">{num.toFixed(2)} €</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <ShieldCheck className="size-4" />
            Sur Vinted, tu reçois 100 % du prix affiché.
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
          Les frais de protection acheteur et la livraison sont payés par l'acheteur : le montant
          affiché sur ton annonce est celui que tu encaisses.
        </div>
      </div>
    </div>
  );
}
