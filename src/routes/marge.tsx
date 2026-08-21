import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Euro, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/marge")({
  head: () => ({
    meta: [
      { title: "Calculateur de marge — ResellBoost AI" },
      {
        name: "description",
        content:
          "Estimez votre bénéfice net et votre marge en % entre le prix d'achat et le prix de revente.",
      },
      { property: "og:title", content: "Calculateur de marge — ResellBoost AI" },
      {
        property: "og:description",
        content: "Bénéfice net et marge estimés en un coup d'œil.",
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
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");

  const buyNum = Number.isFinite(parseFloat(buy)) ? parseFloat(buy) : 0;
  const sellNum = Number.isFinite(parseFloat(sell)) ? parseFloat(sell) : 0;
  const benefit = sellNum - buyNum;
  const marginPercent = buyNum > 0 ? (benefit / buyNum) * 100 : 0;

  return (
    <div className="pb-6">
      <AppHeader title="Marge réelle" subtitle="Prix d'achat vs prix de revente" />
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
          <MoneyField label="Prix d'achat (€)" value={buy} onChange={setBuy} />
          <MoneyField label="Prix de revente (€)" value={sell} onChange={setSell} />
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-6 text-center shadow-card"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.15 162), oklch(0.72 0.16 172))",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
            Bénéfice net estimé
          </p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-white">
            {benefit.toFixed(2)} €
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
            <TrendingUp className="size-4" />
            {marginPercent >= 0 ? "+" : ""}
            {marginPercent.toFixed(0)}% de marge
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
          Le bénéfice net correspond au prix de revente moins le prix d'achat. La marge en % est
          calculée par rapport à ton investissement initial.
        </div>
      </div>
    </div>
  );
}
