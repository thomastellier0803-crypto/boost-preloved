import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { BrandCombobox } from "@/components/BrandCombobox";
import { PaywallDialog } from "@/components/PaywallDialog";
import { PhotoUploader, type Photos } from "@/components/PhotoUploader";
import { ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    ],
  }),
  component: Scanner,
});

const LOADING_STEPS = [
  "Analyse des visuels par IA...",
  "Détection de la marque, taille et composition...",
  "Estimation des prix sur le marché d'occasion...",
];

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
  const [creator, setCreator] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const prefs = getPrefs();
    applyTheme(prefs.theme);
    setPlatform(prefs.platform as Platform);
    setCondition(prefs.condition);
    setUsed(getCredits().used);
    setCreator(isCreator());
  }, []);

  const images = Object.values(photos).filter(Boolean) as string[];
  const baseSizes =
    category === "Chaussures" ? SHOE_SIZES : [...SIZES, ...KID_SIZES];
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
    const timers = [
      setTimeout(() => setStep(1), 2500),
      setTimeout(() => setStep(2), 6000),
    ];
    try {
      const data = await analyze({
        data: { images, platform, brand, category, subcategory, size, condition },
      });
      const parcel = (["Petit", "Moyen", "Grand"] as const).includes(
        data.parcel as "Petit",
      )
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
      toast.success("Annonce générée");
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
        credits={creator ? undefined : { used, quota: FREE_QUOTA }}
      />
      <div className="app-container space-y-6 py-5">
        <PhotoUploader photos={photos} onChange={setPhotos} />

        <div className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div className="space-y-1.5">
            <Label>Marque</Label>
            <BrandCombobox value={brand} onChange={setBrand} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v);
                  setSubcategory("");
                  setSize("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORIES).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sous-catégorie</Label>
              <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {(CATEGORIES[category] ?? []).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Taille</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>État</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Format d'annonce</Label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={
                    platform === p
                      ? "rounded-lg border border-primary bg-accent px-2 py-2 text-xs font-medium text-accent-foreground"
                      : "rounded-lg border border-border bg-background px-2 py-2 text-xs font-medium text-muted-foreground"
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button className="w-full gap-2" size="lg" onClick={run} disabled={loading}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Wand2 className="size-4" />
          )}
          {loading ? "Analyse en cours" : "Analyser et générer"}
        </Button>

        {loading ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="space-y-2">
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
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${((step + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        ) : null}

        {result ? <ResultPanel result={result} /> : null}
      </div>
      <PaywallDialog open={paywall} onOpenChange={setPaywall} />
    </div>
  );
}
