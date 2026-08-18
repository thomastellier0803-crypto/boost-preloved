import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, Crown, Lock, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { updateHistory } from "@/lib/local-store";
import { formatDescription, platformSupportsHashtags } from "@/lib/export-format";
import type { HistoryItem } from "@/lib/resell-data";

const STYLE_HASHTAGS = [
  "streetwear",
  "casual",
  "vintage",
  "friperie",
  "modeseconde main",
  "dressing",
];

const RELANCE_SCRIPTS = [
  "Bonjour, merci d'avoir ajouté cet article en favori. Il est toujours disponible, n'hésitez pas si vous avez une question sur la taille ou l'état.",
  "Bonjour, je fais un peu de place dans mon dressing : cet article vous intéresse toujours ? Envoi rapide et soigné sous 24 h.",
  "Bonjour, petite attention pour les personnes qui suivent cet article : je peux faire un geste sur le prix si vous le prenez aujourd'hui.",
];

const DISCOUNTS = [1, 2, 5];

function reformulate(item: HistoryItem) {
  const base = formatDescription(item, item.platform);
  const lines = base
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const intro = `Toujours disponible : ${item.type}${item.brand ? ` ${item.brand}` : ""} en ${item.color.toLowerCase()}, taille ${item.size}, ${item.condition.toLowerCase()}.`;
  const outro = "Annonce remise à jour aujourd'hui. Envoi rapide et soigné.";
  return [intro, ...lines.filter((l) => l !== intro), outro].join("\n\n");
}

async function copy(text: string, label: string) {
  await navigator.clipboard.writeText(text);
  toast.success(`${label} copié`);
}

export function ProTools({
  item,
  pro,
  onUpdate,
}: {
  item: HistoryItem;
  pro: boolean;
  onUpdate: (item: HistoryItem) => void;
}) {
  const [discount, setDiscount] = useState(DISCOUNTS[0] as number);
  const boosted = STYLE_HASHTAGS.every((h) => item.hashtags.some((x) => x.replace(/^#/, "") === h));
  const score = boosted ? 100 : 65;
  const days = Math.floor((Date.now() - item.createdAt) / 86_400_000);
  const stale = days >= 10;

  function boostSeo() {
    const merged = [
      ...item.hashtags.map((h) => h.replace(/^#/, "")),
      ...STYLE_HASHTAGS.filter((h) => !item.hashtags.some((x) => x.replace(/^#/, "") === h)),
    ];
    const next = { ...item, hashtags: merged };
    updateHistory(next);
    onUpdate(next);
    toast.success("Score de visibilité porté à 100 %");
  }

  function republish() {
    const next = { ...item, description: reformulate(item), createdAt: Date.now() };
    updateHistory(next);
    onUpdate(next);
    toast.success("Description reformulée, annonce prête à être republiée");
  }

  return (
    <section className="relative mt-5 space-y-4 rounded-2xl border border-primary/25 bg-accent/30 p-4">
      <div className="flex items-center gap-2">
        <Crown className="size-4 text-primary" />
        <p className="text-sm font-semibold">Modules Pro</p>
        {!pro ? (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Lock className="size-3" />
            4,99 € / mois
          </span>
        ) : null}
      </div>

      <div className={pro ? "space-y-4" : "space-y-4 opacity-40 blur-[2px]"} aria-hidden={!pro}>
        {/* Boost SEO */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Boost SEO 100 %</p>
            <span className="text-sm font-bold text-primary">{score} %</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
          <button
            type="button"
            disabled={!pro || boosted}
            onClick={boostSeo}
            className="cta-glow mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold disabled:opacity-60"
          >
            <Sparkles className="size-3.5" />
            {boosted ? "Visibilité maximale atteinte" : "Injecter les hashtags de style"}
          </button>
          {platformSupportsHashtags(item.platform) ? null : (
            <p className="mt-2 text-[11px] text-muted-foreground">
              {item.platform} n'affiche pas les hashtags : utilisez-les comme mots-clés dans le
              titre.
            </p>
          )}
        </div>

        {/* Relanceur favoris */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">Relanceur Favoris Express</p>
          <ul className="mt-2 space-y-2">
            {RELANCE_SCRIPTS.map((script, i) => (
              <li key={script} className="rounded-xl bg-accent/50 p-3">
                <p className="text-xs text-muted-foreground">{script}</p>
                <button
                  type="button"
                  disabled={!pro}
                  onClick={() => copy(script, `Script ${i + 1}`)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  <Copy className="size-3.5" />
                  Copier le script {i + 1}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold">Remise express</p>
          <div className="mt-2 flex gap-2">
            {DISCOUNTS.map((d) => (
              <button
                key={d}
                type="button"
                disabled={!pro}
                onClick={() => setDiscount(d)}
                className={`flex-1 rounded-xl border px-2 py-2 text-xs font-semibold transition-colors ${
                  discount === d
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                -{d} €
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Nouveau prix proposé : {Math.max(1, item.prices.recommended - discount)} €
          </p>
          <button
            type="button"
            disabled={!pro}
            onClick={() =>
              copy(
                `Bonjour, je vous propose une offre à ${Math.max(1, item.prices.recommended - discount)} € (au lieu de ${item.prices.recommended} €) valable aujourd'hui. Bonne journée.`,
                "Message d'offre",
              )
            }
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-accent py-2.5 text-xs font-bold text-accent-foreground"
          >
            <TrendingUp className="size-3.5 text-primary" />
            Copier l'offre en 5 secondes
          </button>
        </div>

        {/* Re-publication */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">Re-publication anti-annonce morte</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stale
              ? `En ligne depuis ${days} jours : reformulez la description pour remonter en tête de fil.`
              : `En ligne depuis ${days} jour(s). Disponible à partir de 10 jours.`}
          </p>
          <button
            type="button"
            disabled={!pro || !stale}
            onClick={republish}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-accent py-2.5 text-xs font-bold text-accent-foreground disabled:opacity-50"
          >
            <RefreshCw className="size-3.5 text-primary" />
            Reformuler et republier
          </button>
        </div>
      </div>

      {!pro ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/60 p-4 text-center backdrop-blur-[2px]">
          <p className="max-w-[16rem] text-sm font-semibold">
            Débloquez Boost SEO, Relanceur Favoris et Re-publication
          </p>
          <Link
            to="/pro"
            className="cta-glow inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"
          >
            <Crown className="size-3.5" />
            Passer à Pro — 4,99 € / mois
          </Link>
        </div>
      ) : null}
    </section>
  );
}
