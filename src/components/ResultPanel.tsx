import { useEffect, useState } from "react";
import { Copy, Check, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AnalysisResult } from "@/lib/resell-data";
import {
  formatDescription,
  formatHashtags,
  platformSupportsHashtags,
} from "@/lib/export-format";

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
  const platform = result.platform;
  const withHashtags = platformSupportsHashtags(platform);

  const [title, setTitle] = useState(result.title);
  const [description, setDescription] = useState(() => formatDescription(result, platform));
  const [hashtags, setHashtags] = useState(() => formatHashtags(result, platform));

  useEffect(() => {
    setTitle(result.title);
    setDescription(formatDescription(result, platform));
    setHashtags(formatHashtags(result, platform));
  }, [result, platform]);

  const all = withHashtags
    ? `${title}\n\n${description}\n\n${hashtags}`.trim()
    : `${title}\n\n${description}`.trim();

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

      <div className="space-y-4 rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Annonce {platform} — modifiable
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="rb-title">Titre</Label>
          <Input id="rb-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rb-desc">Description</Label>
          <Textarea
            id="rb-desc"
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {withHashtags ? (
          <div className="space-y-1.5">
            <Label htmlFor="rb-tags">Hashtags</Label>
            <Textarea
              id="rb-tags"
              rows={3}
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Hashtags retirés automatiquement pour {platform}.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <CopyButton label="Copier le titre" value={title} />
        <CopyButton label="Copier la description" value={description} />
        {withHashtags ? <CopyButton label="Copier les hashtags" value={hashtags} /> : null}
        <CopyButton label="Tout copier" value={all} variant="default" />
      </div>
    </div>
  );
}
