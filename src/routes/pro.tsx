import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Crown,
  Gem,
  Layers,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      {
        title:
          "Rentabilisé dès ta 1ère vente du mois — ResellBoost Pro",
      },
      {
        name: "description",
        content:
          "Passe à ResellBoost Pro : multi-scan par lot, cross-posting 1-clic, re-publication anti-annonce morte et estimation pépites & marques pour 4,99 €/mois.",
      },
      {
        property: "og:title",
        content: "Rentabilisé dès ta 1ère vente du mois — ResellBoost Pro",
      },
      {
        property: "og:description",
        content:
          "4 outils vendeur pour gagner du temps et doubler tes ventes sur Vinted, Leboncoin et Vestiaire Collective.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProPage,
});

const features = [
  {
    icon: Layers,
    title: "Multi-Scan par lot",
    description:
      "Prends jusqu'à 10 vêtements en photo d'affilée. L'IA génère les 10 annonces d'un coup, sans repasser par le scanner (vs 1 par 1 en version gratuite).",
  },
  {
    icon: ArrowLeftRight,
    title: "Cross-Posting 1-Clic",
    description:
      "Exportation automatique optimisée pour publier sur Vinted ET Leboncoin simultanément et doubler ta visibilité.",
  },
  {
    icon: RefreshCw,
    title: "Re-publication Anti-Annonce Morte",
    description:
      "Génère une version réécrite unique pour republier les articles en ligne depuis plus de 10 jours, sans risque de bannissement par les robots Vinted.",
  },
  {
    icon: Gem,
    title: "Estimation Pépites & Marques",
    description:
      "Détection précise des modèles rares et des vrais prix de vente constatés pour éviter de sous-vendre.",
  },
];

function ProPage() {
  return (
    <div className="pb-6">
      <AppHeader
        title="Pro"
        subtitle="Le pack vendeur pour gagner du temps et doubler tes ventes"
      />

      <div className="app-container space-y-5 py-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Rentabilisé dès ta 1ère vente du mois
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Gagne 3 heures par semaine et fais sauter les blocages d'algorithme
            Vinted.
          </p>
        </div>

        <div
          className="sheen relative overflow-hidden rounded-3xl p-6 shadow-card"
          style={{ background: "var(--gradient-brand)" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            <Crown className="size-3" />
            Pack Pro
          </span>
          <p className="mt-3 text-xl font-semibold text-white">
            ResellBoost Pro
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-white">
            4,99 €{" "}
            <span className="text-sm font-medium text-white/80">/ mois</span>
          </p>
          <p className="mt-1 text-sm text-white/85">
            Sans engagement, résiliable à tout moment.
          </p>
        </div>

        <div className="grid gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card flex items-start gap-4 p-4 transition-transform active:scale-[0.98]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon className="size-5 text-primary" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => toast.info("Paiement bientôt disponible")}
            className="cta-glow pulse-glow flex h-13 w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-bold"
          >
            <Sparkles className="size-4" />
            Débloquer le Pack Pro — 4,99 € / mois
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Sans engagement • Annulable en 1 clic
          </p>
        </div>
      </div>
    </div>
  );
}
