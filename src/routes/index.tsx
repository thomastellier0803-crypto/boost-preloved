import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { BrandCombobox } from "@/components/BrandCombobox";
import { Chip, ChipGroup } from "@/components/Chip";
import { PaywallDialog } from "@/components/PaywallDialog";
import { PhotoUploader, type Photos } from "@/components/PhotoUploader";
import { ResultPanel } from "@/components/ResultPanel";
import { analyzeGarment } from "@/lib/analyze.functions";
import {
  CATEGORIES,
  CONDITIONS,
  PLATFORMS,
  SHOE_SIZES,
  SIZES,
  KID_SIZES,
  type AnalysisResult,
  type Platform,
} from "@/lib/resell-data";
import {
  FREE_QUOTA,
  addHistory,
  consumeCredit,
  getCredits,
  getPrefs,
  applyTheme,
  isCreator,
} from "@/lib/local-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResellBoost AI — Annonces Vinted générées par IA" },
      {
        name: "description",
        content:
          "Photographiez un vêtement, obtenez un titre, une description, un prix marché et le format de colis pour Vinted, Leboncoin et Vestiaire Collective.",
      },
      { property: "og:title", content: "ResellBoost AI — Scanner de vêtements" },
      {
        property: "og:description",
        content: "Analyse photo IA et estimation de prix pour la revente de vêtements d'occasion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scanner,
});

const LOADING_STEPS = [
  "Analyse des visuels par IA...",
  "Détection de la marque, taille et composition...",
  "Estimation des prix sur le marché d'occasion...",
];

function SegmentedPlatforms({
  value,
  onChange,
}: {
  value: Platform;
  onChange: (p: Platform) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
      {PLATFORMS.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={
            value === p
              ? "cta-glow rounded-full px-2 py-2 text-[11px] font-semibold"
              : "rounded-full px-2 py-2 text-[11px] font-medium text-muted-foreground transition-colors"
          }
        >
          {p === "Vestiaire Collective" ? "Vestiaire" : p}
        </button>
      ))}
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="shimmer h-20 rounded-2xl" />
        ))}
      </div>
      <div className="shimmer h-40 rounded-2xl" />
      <div className="shimmer h-56 rounded-2xl" />
    </div>
  );
}

function Scanner() {
  const analyze = useServerFn(analyzeGarment);
  const [photos, setPhotos] = useState<Photos>({});
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("Très bon état");
  const [platform, setPlatform] = useState<Platform>("Vinted");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [used, setUsed] = useState(0);
  const [paywall, setPaywall] = useState(false);
  const [step, setStep] = useState(0);
  const creator = usePro();

  useEffect(() => {
    const prefs = getPrefs();
    applyTheme(prefs.theme);
    setPlatform(prefs.platform as Platform);
    setCondition(prefs.condition);
    setUsed(getCredits().used);
  }, []);

  const images = Object.values(photos).filter(Boolean) as string[];
  const showWearAlert = Boolean(result?.wearDetected) && condition !== "Satisfaisant";
  const adjustedPrice = result ? Math.max(3, Math.round(result.prices.recommended * 0.75)) : 0;

  function applyRecommendation() {
    if (!result) return;
    setCondition("Satisfaisant");
    setResult({
      ...result,
      condition: "Satisfaisant",
      prices: {
        quick: Math.max(2, Math.round(adjustedPrice * 0.7)),
        recommended: adjustedPrice,
        max: Math.max(adjustedPrice + 2, Math.round(adjustedPrice * 1.3)),
      },
    });
    toast.success("État et prix ajustés");
  }
  const baseSizes = category === "Chaussures" ? SHOE_SIZES : [...SIZES, ...KID_SIZES];
  const sizeOptions = size && !baseSizes.includes(size) ? [size, ...baseSizes] : baseSizes;

  async function run() {
    if (!images.length) {
      toast.error("Ajoutez au moins une photo");
      return;
    }
    if (!creator && used >= FREE_QUOTA) {
      setPaywall(true);
      return;
    }
    setLoading(true);
    setStep(0);
    const timers = [setTimeout(() => setStep(1), 2500), setTimeout(() => setStep(2), 6000)];
    try {
      const data = await analyze({
        data: { images, platform, brand, category, subcategory, size, condition },
      });
      const parcel = (["Petit", "Moyen", "Grand"] as const).includes(data.parcel as "Petit")
        ? (data.parcel as AnalysisResult["parcel"])
        : "Moyen";
      const next: AnalysisResult = { ...data, parcel, platform };
      setResult(next);
      if (data.brand) setBrand(data.brand);
      if (data.category && CATEGORIES[data.category]) {
        setCategory(data.category);
        if (data.subcategory && CATEGORIES[data.category]?.includes(data.subcategory)) {
          setSubcategory(data.subcategory);
        }
      }
      if (data.size) setSize(data.size);
      if (data.condition && (CONDITIONS as readonly string[]).includes(data.condition)) {
        setCondition(data.condition);
      }
      if (!creator) setUsed(consumeCredit().used);
      addHistory({
        ...next,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        thumbnail: images[0],
      });
      toast.success("Annonce générée et sauvegardée");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analyse impossible");
    } finally {
      timers.forEach(clearTimeout);
      setLoading(false);
      setStep(0);
    }
  }

  return (
    <div className="pb-6">
      <AppHeader
        title="Scanner"
        subtitle="Analyse photo et estimation de prix"
        {...(creator ? {} : { credits: { used, quota: FREE_QUOTA } })}
      />
      <div className="app-container space-y-6 py-5">
        <PhotoUploader photos={photos} onChange={setPhotos} />

        <div className="glass-card space-y-5 p-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Marque
            </p>
            <BrandCombobox value={brand} onChange={setBrand} />
          </div>

          <ChipGroup label="Catégorie">
            {Object.keys(CATEGORIES).map((c) => (
              <Chip
                key={c}
                active={category === c}
                onClick={() => {
                  setCategory(category === c ? "" : c);
                  setSubcategory("");
                  setSize("");
                }}
              >
                {c}
              </Chip>
            ))}
          </ChipGroup>

          {category ? (
            <ChipGroup label="Sous-catégorie">
              {(CATEGORIES[category] ?? []).map((s) => (
                <Chip
                  key={s}
                  active={subcategory === s}
                  onClick={() => setSubcategory(subcategory === s ? "" : s)}
                >
                  {s}
                </Chip>
              ))}
            </ChipGroup>
          ) : null}

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Taille
            </p>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {sizeOptions.map((s) => (
                <Chip
                  key={s}
                  active={size === s}
                  onClick={() => setSize(size === s ? "" : s)}
                  className="shrink-0 whitespace-nowrap"
                >
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          <ChipGroup label="État">
            {CONDITIONS.map((c) => (
              <Chip key={c} active={condition === c} onClick={() => setCondition(c)}>
                {c}
              </Chip>
            ))}
          </ChipGroup>

          {showWearAlert && result ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3.5">
              <div className="flex gap-2.5">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-destructive" />
                <div className="space-y-2">
                  <p className="text-xs leading-relaxed">
                    <span className="font-semibold">Conseil Vendeur IA :</span> l'IA détecte une
                    usure visuelle sur le tissu
                    {result.wearNote ? ` (${result.wearNote})` : ""}. Pour éviter un litige Vinted
                    ou une note 1 étoile, nous vous conseillons l'État satisfaisant (prix ajusté
                    conseillé : {adjustedPrice} €).
                  </p>
                  <button
                    type="button"
                    onClick={applyRecommendation}
                    className="rounded-full bg-destructive px-3.5 py-1.5 text-[11px] font-semibold text-destructive-foreground"
                  >
                    Appliquer la recommandation
                  </button>
                </div>
              </div>
            </div>
          ) : null}


          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Format d'annonce
            </p>
            <SegmentedPlatforms value={platform} onChange={setPlatform} />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="cta-glow flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Sparkles className="size-5" />
          )}
          {loading ? "Analyse en cours" : "Analyser et générer"}
        </button>

        {loading ? (
          <div className="space-y-4">
            <div className="glass-card p-4">
              <div className="space-y-2.5">
                {LOADING_STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={
                      i <= step
                        ? "flex items-center gap-2 text-sm font-medium"
                        : "flex items-center gap-2 text-sm text-muted-foreground"
                    }
                  >
                    {i < step ? (
                      <Check className="size-4 text-primary" />
                    ) : i === step ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <span className="size-4" />
                    )}
                    {label}
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${((step + 1) / LOADING_STEPS.length) * 100}%`,
                    background: "var(--gradient-brand)",
                  }}
                />
              </div>
            </div>
            <ResultSkeleton />
          </div>
        ) : null}

        {!loading && result ? <ResultPanel result={result} /> : null}
      </div>
      <PaywallDialog open={paywall} onOpenChange={setPaywall} />
    </div>
  );
}
