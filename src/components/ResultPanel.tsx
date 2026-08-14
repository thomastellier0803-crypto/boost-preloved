import { useState } from "react";
import { Copy, Check, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/resell-data";

function CopyButton({
  label,
  value,
  variant = "outline",
}: {
  label: string;
  value: string;
  variant?: "outline" | "default";
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant={variant}
      size="sm"
      className="gap-1.5"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          /* ignore */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copié !" : label}
    </Button>
  );
}

const priceCards = [
  { key: "quick", title: "Vente rapide", note: "1-3 jours" },
  { key: "recommended", title: "Prix recommandé", note: "Moyenne Vinted" },
  { key: "max", title: "Prix max", note: "État parfait" },
] as const;

export function ResultPanel({ result }: { result: AnalysisResult }) {
  const hashtags = result.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ");
  const all = `${result.title}\n\n${result.description}\n\n${hashtags}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {priceCards.map((card) => (
          <div
            key={card.key}
            className={
              card.key === "recommended"
                ? "rounded-xl border border-primary bg-accent p-3 text-center"
                : "rounded-xl border border-border bg-card p-3 text-center"
            }
          >
            <p className="text-lg font-semibold tracking-tight">
              {result.prices[card.key]} €
            </p>
            <p className="mt-0.5 text-[11px] font-medium">{card.title}</p>
            <p className="text-[10px] text-muted-foreground">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          {[
            ["Type", result.type],
            ["Marque", result.brand],
            ["Couleur", result.color],
            ["Coupe", result.fit],
            ["Taille", result.size],
            ["Matière", result.material],
            ["État", result.condition],
          ].map(([k, v]) =>
            v ? (
              <div key={k} className="contents">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ) : null,
          )}
        </dl>
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm">
          <Package className="size-4 text-primary" />
          <span className="font-medium">Colis {result.parcel}</span>
          <span className="text-xs text-muted-foreground">{result.parcelNote}</span>
        </div>
        {result.defects.length ? (
          <div className="mt-3 flex gap-2 rounded-lg bg-muted p-3 text-xs">
            <AlertTriangle className="size-4 shrink-0 text-destructive" />
            <span>{result.defects.join(" · ")}</span>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Titre
        </p>
        <p className="mt-1 font-medium">{result.title}</p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Description
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{result.description}</p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Hashtags
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{hashtags}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <CopyButton label="Copier le titre" value={result.title} />
        <CopyButton label="Copier la description" value={result.description} />
        <CopyButton label="Copier les hashtags" value={hashtags} />
        <CopyButton label="Tout copier" value={all} variant="default" />
      </div>
    </div>
  );
}
