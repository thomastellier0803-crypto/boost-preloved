import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "ResellBoost Pro — Pack à 4,99 €/mois" },
      {
        name: "description",
        content:
          "Passez à ResellBoost Pro : Boost SEO, relanceur favoris, alerte anti-litige IA et re-publication automatique.",
      },
      { property: "og:title", content: "ResellBoost Pro — Pack à 4,99 €/mois" },
      {
        property: "og:description",
        content: "4 outils exclusifs pour vendre ton stock 3x plus vite.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProPage,
});

const features = [
  {
    title: "Boost SEO 100 %",
    description: "Injection automatique des hashtags de style pour maximiser la visibilité.",
  },
  {
    title: "Relanceur de Favoris Express",
    description: "Scripts polis prêts à copier + curseur de réduction dynamique (-1 €, -2 €, -5 €).",
  },
  {
    title: "Alerte Anti-Litige IA",
    description: "Détection d'usure visuelle et protection de ton compte vendeur.",
  },
  {
    title: "Re-publication Anti-Annonce Morte",
    description: "Reformulation en 1 clic pour remonter ton annonce en tête de fil.",
  },
];

function ProPage() {
  return (
    <div className="pb-6">
      <AppHeader title="Pro" subtitle="Le pack vendeur 4,99 € / mois" />
      <div className="app-container space-y-5 py-5">
        <div
          className="sheen relative overflow-hidden rounded-3xl p-6 shadow-card"
          style={{ background: "var(--gradient-brand)" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            <Crown className="size-3" />
            Pack Pro
          </span>
          <p className="mt-3 text-xl font-semibold text-white">ResellBoost Pro</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-white">
            4,99 € <span className="text-sm font-medium text-white/80">/ mois</span>
          </p>
          <p className="mt-1 text-sm text-white/85">Sans engagement, résiliable à tout moment.</p>

          <button
            type="button"
            onClick={() => toast.info("Paiement bientôt disponible")}
            className="pulse-glow mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-background px-4 py-4 text-sm font-bold text-foreground transition-transform active:scale-[0.97]"
          >
            <Sparkles className="size-4 text-primary" />
            Passer à Pro
          </button>
        </div>

        <div className="glass-card space-y-1 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            4 avantages exclusifs
          </p>
          <ul className="mt-3 space-y-3">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                  <Check className="size-3 text-success" strokeWidth={3} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

