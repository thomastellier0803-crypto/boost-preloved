import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Euro } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/marge")({
  head: () => ({
    meta: [
      { title: "Calculateur de gain net — ResellBoost AI" },
      {
        name: "description",
        content:
          "Estimez ce qu'il vous reste réellement après la vente sur Vinted, Leboncoin ou Vestiaire.",
      },
      { property: "og:title", content: "Calculateur de gain net — ResellBoost AI" },
      {
        property: "og:description",
        content: "Gain net estimé dans votre poche en un coup d'œil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarginPage,
});

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="relative block">
        <Euro className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" />
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(",", "."))}
          placeholder="0,00"
          className="h-14 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-lg font-semibold tracking-tight shadow-card outline-none transition-shadow focus:border-primary focus:shadow-glow"
        />
      </span>
    </label>
  );
}

const SPEED_PRESETS = [
  { key: "quick", label: "Vente rapide 48h", price: "3" },
  { key: "avg", label: "Prix moyen Vinted", price: "5" },
  { key: "high", label: "Prix fort", price: "7" },
] as const;

function MarginPage() {
  const [sell, setSell] = useState("");
  const net = Number.isFinite(parseFloat(sell)) ? parseFloat(sell) : 0;

  return (
    <div className="pb-6">
      <AppHeader title="Net en poche" subtitle="Ce que tu touches vraiment" />
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
                  onClick={() => setSell(p.price)}
                  className={
                    sell === p.price
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
          <MoneyField label="Prix de vente affiché" value={sell} onChange={setSell} />
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-6 text-center shadow-card"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.15 162), oklch(0.72 0.16 172))",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
            Gain net estimé dans ta poche
          </p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-white">
            {net.toFixed(2)} €
          </p>
          <p className="mt-3 text-sm font-medium text-white/90">
            Sur Vinted, c'est le prix affiché que tu touches.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
          L'acheteur Vinted paie les frais de protection et la livraison : en tant que vendeur
          particulier, tu reçois en général le montant affiché.
        </div>
      </div>
    </div>
  );
}

