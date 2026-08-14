import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "ResellBoost Pro — Annonces illimitées à 4,99 €/mois" },
      {
        name: "description",
        content:
          "Passez à ResellBoost Pro pour générer un nombre illimité d'annonces optimisées et débloquer tous les formats d'export.",
      },
      { property: "og:title", content: "ResellBoost Pro — 4,99 € par mois" },
      {
        property: "og:description",
        content: "Générations illimitées, analyse prioritaire et historique sans limite.",
      },
    ],
  }),
  component: ProPage,
});

const rows = [
  { label: "Annonces par jour", free: "3", pro: "Illimité" },
  { label: "Analyse photo IA", free: true, pro: true },
  { label: "Estimation de prix marché", free: true, pro: true },
  { label: "Export Vinted", free: true, pro: true },
  { label: "Export Leboncoin et Vestiaire", free: false, pro: true },
  { label: "Historique sauvegardé", free: "20 annonces", pro: "Illimité" },
  { label: "Analyse prioritaire", free: false, pro: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "string") return <span className="text-xs font-medium">{value}</span>;
  return value ? (
    <Check className="mx-auto size-4 text-primary" />
  ) : (
    <Minus className="mx-auto size-4 text-muted-foreground" />
  );
}

function ProPage() {
  return (
    <div className="pb-6">
      <AppHeader title="Pro" subtitle="Comparez les formules" />
      <div className="app-container space-y-5 py-5">
        <div className="rounded-xl border border-primary bg-accent p-5">
          <p className="text-sm font-medium text-accent-foreground">ResellBoost Pro</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            4,99 € <span className="text-sm font-normal text-muted-foreground">/ mois</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Sans engagement, résiliable à tout moment.
          </p>
          <Button className="mt-4 w-full">Passer à Pro</Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Fonctionnalité</th>
                <th className="px-3 py-3 text-center font-medium">Gratuit</th>
                <th className="px-3 py-3 text-center font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{row.label}</td>
                  <td className="px-3 py-3 text-center">
                    <Cell value={row.free} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Cell value={row.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
