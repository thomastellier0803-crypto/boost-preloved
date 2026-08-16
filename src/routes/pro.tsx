import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Minus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProPage,
});

const perks = [
  "Générations d'annonces illimitées",
  "Analyse photo IA prioritaire",
  "Export Vinted, Leboncoin et Vestiaire",
  "Historique illimité et sauvegardé",
  "Estimation de prix marché avancée",
];

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
  if (typeof value === "string") return <span className="text-xs font-semibold">{value}</span>;
  return value ? (
    <Check className="mx-auto size-4 text-success" />
  ) : (
    <Minus className="mx-auto size-4 text-muted-foreground" />
  );
}

function ProPage() {
  return (
    <div className="pb-6">
      <AppHeader title="Pro" subtitle="Débloquez tout le potentiel" />
      <div className="app-container space-y-5 py-5">
        <div
          className="sheen relative overflow-hidden rounded-3xl p-6 shadow-card"
          style={{ background: "var(--gradient-brand)" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            <Crown className="size-3" />
            Offre recommandée
          </span>
          <p className="mt-3 text-xl font-semibold text-white">ResellBoost Pro</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-white">
            4,99 € <span className="text-sm font-medium text-white/80">/ mois</span>
          </p>
          <p className="mt-1 text-sm text-white/85">Sans engagement, résiliable à tout moment.</p>

          <ul className="mt-4 space-y-2">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-white">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-white/25">
                  <Check className="size-3 text-white" strokeWidth={3} />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => toast.info("Paiement bientôt disponible")}
            className="pulse-glow mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-background px-4 py-4 text-sm font-bold text-foreground transition-transform active:scale-[0.97]"
          >
            <Sparkles className="size-4 text-primary" />
            Passer à Pro
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-left font-semibold">Fonctionnalité</th>
                <th className="px-3 py-3 text-center font-semibold">Gratuit</th>
                <th className="px-3 py-3 text-center font-semibold text-primary">Pro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{row.label}</td>
                  <td className="px-3 py-3 text-center">
                    <Cell value={row.free} />
                  </td>
                  <td className="bg-accent/40 px-3 py-3 text-center">
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
