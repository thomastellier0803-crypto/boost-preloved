import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { BrandCombobox } from "@/components/BrandCombobox";
import { PaywallDialog } from "@/components/PaywallDialog";
import { PhotoUploader, type Photos } from "@/components/PhotoUploader";
import { ResultPanel } from "@/components/ResultPanel";
import { SelectSheet } from "@/components/SelectSheet";
import { analyzeGarment } from "@/lib/analyze.functions";
import {
  CATEGORIES,
  COLORS,
  CONDITIONS,
  CONDITION_DETAILS,
  GENDERS,
  MATERIALS,
  PLATFORMS,
  SHOE_SIZES,
  SIZES,
  STYLES,
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
} from "@/lib/local-store";
import { usePro } from "@/hooks/use-pro";

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

const opts = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Scanner() {
  const analyze = useServerFn(analyzeGarment);
  const [photos, setPhotos] = useState<Photos>({});
  const [brand, setBrand] = useState("");
  const [brandOpen, setBrandOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("Très bon état");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [style, setStyle] = useState("");
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

  const baseSizes =
    category === "Chaussures"
      ? SHOE_SIZES
      : gender === "Enfant"
        ? KID_SIZES
        : [...SIZES, ...KID_SIZES];
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
        data: {
          images,
          platform,
          brand,
          category,
          subcategory,
          size,
          condition,
          gender,
          color,
          material,
          style,
        },
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
      if (data.color) setColor(data.color);
      if (data.material) setMaterial(data.material);
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
    <div className="pb-32">
      <AppHeader
        title="Scanner"
        subtitle="Analyse photo et estimation de prix"
        {...(creator ? {} : { credits: { used, quota: FREE_QUOTA } })}
      />
      <div className="app-container space-y-4 py-5">
        <PhotoUploader photos={photos} onChange={setPhotos} />

        <SectionCard title="Informations principales">
          {brandOpen ? (
            <div className="space-y-2 rounded-2xl border border-primary/40 bg-card p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Marque
              </p>
              <BrandCombobox
                value={brand}
                onChange={(v) => {
                  setBrand(v);
                  setBrandOpen(false);
                }}
              />
              <button
                type="button"
                onClick={() => setBrandOpen(false)}
                className="text-xs font-medium text-muted-foreground"
              >
                Fermer
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setBrandOpen(true)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left ${
                brand ? "border-primary/40" : "border-border"
              }`}
            >
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Marque
                </span>
                <span
                  className={`block truncate text-sm ${brand ? "font-semibold" : "font-medium text-muted-foreground"}`}
                >
                  {brand || "Choisir une marque"}
                </span>
              </span>
            </button>
          )}

          <SelectSheet
            label="Genre"
            value={gender}
            options={opts(GENDERS)}
            onChange={(v) => {
              setGender(v);
              setSize("");
            }}
            columns={2}
          />

          <SelectSheet
            label="Catégorie"
            value={category}
            options={opts(Object.keys(CATEGORIES))}
            onChange={(v) => {
              setCategory(v);
              setSubcategory("");
              setSize("");
            }}
            columns={2}
          />

          <SelectSheet
            label="Sous-catégorie"
            value={subcategory}
            placeholder={category ? "Choisir" : "Sélectionne une catégorie"}
            options={opts(CATEGORIES[category] ?? [])}
            onChange={setSubcategory}
            columns={2}
            disabled={!category}
          />

          <SelectSheet
            label="Taille"
            value={size}
            options={opts(sizeOptions)}
            onChange={setSize}
            columns={category === "Chaussures" ? 3 : 2}
            description={
              category === "Chaussures" ? "Pointures 36 à 46" : "Tailles adulte et enfant"
            }
          />

          <SelectSheet
            label="État"
            value={condition}
            options={CONDITIONS.map((c) => ({
              value: c,
              label: c,
              hint: CONDITION_DETAILS[c] ?? "",
            }))}
            onChange={(v) => setCondition(v || "Très bon état")}
            columns={1}
            clearable={false}
          />
        </SectionCard>

        <SectionCard title="Détails optionnels">
          <SelectSheet label="Couleur" value={color} options={opts(COLORS)} onChange={setColor} />
          <SelectSheet
            label="Matière"
            value={material}
            options={opts(MATERIALS)}
            onChange={setMaterial}
            columns={2}
          />
          <SelectSheet
            label="Style / coupe"
            value={style}
            options={opts(STYLES)}
            onChange={setStyle}
            columns={2}
          />
        </SectionCard>

        <SectionCard title="Format d'annonce">
          <SegmentedPlatforms value={platform} onChange={setPlatform} />
        </SectionCard>

        {showWearAlert && result ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3.5">
            <div className="flex gap-2.5">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div className="space-y-2">
                <p className="text-xs leading-relaxed">
                  <span className="font-semibold">Conseil Vendeur IA :</span> l'IA détecte une
                  usure visuelle sur le tissu
                  {result.wearNote ? ` (${result.wearNote})` : ""}. Pour éviter un litige Vinted ou
                  une note 1 étoile, nous vous conseillons l'État satisfaisant (prix ajusté
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

      <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="app-container py-3">
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
        </div>
      </div>

      <PaywallDialog open={paywall} onOpenChange={setPaywall} />
    </div>
  );
}
