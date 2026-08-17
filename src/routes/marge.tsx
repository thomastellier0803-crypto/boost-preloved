import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Euro, TrendingUp, TrendingDown } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/marge")({
  head: () => ({
    meta: [
      { title: "Calculateur de marge — ResellBoost AI" },
      {
        name: "description",
        content:
          "Calculez votre bénéfice net : prix d'achat, prix de vente, frais et livraison inclus.",
      },
      { property: "og:title", content: "Calculateur de marge — ResellBoost AI" },
      {
        property: "og:description",
        content: "Bénéfice net et rentabilité de chaque revente en un coup d'œil.",
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
  tone = "neutral",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  tone?: "neutral" | "cost";
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="relative block">
        <Euro
          className={
            tone === "cost"
              ? "absolute left-4 top-1/2 size-4 -translate-y-1/2 text-destructive"
              : "absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary"
          }
        />
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
  const [fees, setFees] = useState("");
  const [shipping, setShipping] = useState("");

  const n = (v: string) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : 0);
  const net = n(sell) - n(fees) - n(shipping);
  const margin = n(sell) > 0 ? (net / n(sell)) * 100 : 0;
  const gauge = Math.max(0, Math.min(100, margin));
  const positive = net >= 0;

  return (
    <div className="pb-6">
      <AppHeader title="Marge" subtitle="Ce qu'il te reste vraiment" />
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
          <MoneyField label="Prix de vente" value={sell} onChange={setSell} />
          <MoneyField label="Frais de plateforme" value={fees} onChange={setFees} tone="cost" />
          <MoneyField
            label="Expédition à ma charge"
            value={shipping}
            onChange={setShipping}
            tone="cost"
          />
        </div>


        <div
          className="relative overflow-hidden rounded-3xl p-6 text-center shadow-card"
          style={{
            background: positive
              ? "linear-gradient(135deg, oklch(0.62 0.15 162), oklch(0.72 0.16 172))"
              : "linear-gradient(135deg, oklch(0.58 0.19 22), oklch(0.66 0.2 32))",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
            Gain net
          </p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-white">
            {net.toFixed(2)} €
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            {positive ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            Marge {margin.toFixed(0)} %
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${positive ? gauge : 100}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] font-medium text-white/85">
            {margin >= 50
              ? "Excellente rentabilité"
              : margin >= 25
                ? "Bonne rentabilité"
                : margin > 0
                  ? "Rentabilité faible"
                  : "Opération à perte"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
          Sur Vinted, l'acheteur paie les frais de protection et la livraison. Renseignez les frais
          uniquement si vous offrez le port ou vendez sur une plateforme à commission.
        </div>
      </div>
    </div>
  );
}
