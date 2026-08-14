import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    ],
  }),
  component: MarginPage,
});

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(",", "."))}
          placeholder="0"
          className="pr-8"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          €
        </span>
      </div>
    </div>
  );
}

function MarginPage() {
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [fees, setFees] = useState("");
  const [shipping, setShipping] = useState("");

  const n = (v: string) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : 0);
  const net = n(sell) - n(buy) - n(fees) - n(shipping);
  const margin = n(sell) > 0 ? (net / n(sell)) * 100 : 0;

  return (
    <div className="pb-6">
      <AppHeader title="Marge" subtitle="Bénéfice net par article" />
      <div className="app-container space-y-5 py-5">
        <div className="space-y-4 rounded-xl border border-border bg-card p-4">
          <NumberField label="Prix d'achat" value={buy} onChange={setBuy} />
          <NumberField label="Prix de vente" value={sell} onChange={setSell} />
          <NumberField label="Frais de plateforme" value={fees} onChange={setFees} />
          <NumberField label="Frais d'expédition à ma charge" value={shipping} onChange={setShipping} />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Gain net
          </p>
          <p
            className={
              net >= 0
                ? "mt-1 text-4xl font-semibold tracking-tight text-primary"
                : "mt-1 text-4xl font-semibold tracking-tight text-destructive"
            }
          >
            {net.toFixed(2)} €
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Marge : {margin.toFixed(0)} % du prix de vente
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
          Sur Vinted, l'acheteur paie les frais de protection et la livraison. Renseignez les frais
          uniquement si vous offrez le port ou vendez sur une plateforme à commission.
        </div>
      </div>
    </div>
  );
}
