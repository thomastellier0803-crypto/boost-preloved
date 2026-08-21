import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Moon, Sun, SunMoon, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Chip } from "@/components/Chip";
import { Switch } from "@/components/ui/switch";
import {
  applyTheme,
  clearHistory,
  defaultPrefs,
  getHistory,
  getPrefs,
  setPrefs,
  type Prefs,
} from "@/lib/local-store";
import { CONDITIONS, PLATFORMS } from "@/lib/resell-data";

export const Route = createFileRoute("/reglages")({
  head: () => ({
    meta: [
      { title: "Réglages — ResellBoost AI" },
      {
        name: "description",
        content: "Thème d'affichage, plateforme par défaut et gestion de vos données locales.",
      },
      { property: "og:title", content: "Réglages — ResellBoost AI" },
      {
        property: "og:description",
        content: "Personnalisez ResellBoost AI et gérez vos données enregistrées.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="glass-card divide-y divide-border overflow-hidden">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 p-4">{children}</div>;
}

const THEMES = [
  { value: "system", label: "Système", icon: SunMoon },
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
] as const;

function SettingsPage() {
  const [prefs, setLocalPrefs] = useState<Prefs>(defaultPrefs);
  const [count, setCount] = useState(0);
  const [code, setCode] = useState("");
  const [creator, setCreatorState] = useState(false);

  useEffect(() => {
    setLocalPrefs(getPrefs());
    setCount(getHistory().length);
    setCreatorState(isCreator());
  }, []);

  function update(patch: Partial<Prefs>) {
    const next = { ...prefs, ...patch };
    setLocalPrefs(next);
    setPrefs(next);
    applyTheme(next.theme);
  }

  return (
    <div className="pb-6">
      <AppHeader title="Réglages" subtitle="Préférences et données" />
      <div className="app-container space-y-6 py-5">
        <Section title="Affichage">
          <Row>
            <p className="text-sm font-medium">Thème</p>
            <div className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
              {THEMES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ theme: value })}
                  className={
                    prefs.theme === value
                      ? "cta-glow flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold"
                      : "flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium text-muted-foreground"
                  }
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        <Section title="Préférences">
          <Row>
            <p className="text-sm font-medium">Plateforme par défaut</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <Chip key={p} active={prefs.platform === p} onClick={() => update({ platform: p })}>
                  {p}
                </Chip>
              ))}
            </div>
          </Row>
          <Row>
            <p className="text-sm font-medium">État par défaut</p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <Chip
                  key={c}
                  active={prefs.condition === c}
                  onClick={() => update({ condition: c })}
                >
                  {c}
                </Chip>
              ))}
            </div>
          </Row>
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium">Descriptions sans emoji</p>
              <p className="text-xs text-muted-foreground">Texte sobre et professionnel</p>
            </div>
            <Switch
              checked={prefs.noEmoji}
              onCheckedChange={(checked) => update({ noEmoji: checked })}
            />
          </div>
        </Section>

        <Section title="Créateur">
          {creator ? (
            <Row>
              <div className="flex items-center gap-2 rounded-2xl bg-success/15 p-3 text-sm font-semibold text-success">
                <ShieldCheck className="size-4" />
                Créateur Pro Illimité actif
              </div>
              <button
                type="button"
                className="mt-1 w-full rounded-2xl border border-border py-3 text-sm font-medium transition-colors hover:bg-muted"
                onClick={() => {
                  setCreator(false);
                  setCreatorState(false);
                  toast.success("Mode créateur désactivé");
                }}
              >
                Désactiver le mode créateur
              </button>
            </Row>
          ) : (
            <Row>
              <p className="text-sm font-medium">Code Administrateur</p>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" />
                <Input
                  id="admin-code"
                  type="password"
                  autoComplete="off"
                  maxLength={32}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Saisir le code"
                  className="h-12 rounded-2xl bg-card pl-11 tracking-[0.25em] shadow-card"
                />
              </div>
              <button
                type="button"
                className="cta-glow mt-1 w-full rounded-2xl py-3 text-sm font-semibold"
                onClick={() => {
                  if (code.trim() === CREATOR_CODE) {
                    setCreator(true);
                    setCreatorState(true);
                    setCode("");
                    toast.success("Mode Créateur Débloqué !");
                  } else {
                    toast.error("Code administrateur invalide");
                  }
                }}
              >
                Valider le code
              </button>
            </Row>
          )}
        </Section>

        <Section title="Données">
          <Row>
            <p className="text-sm text-muted-foreground">
              {count} annonce(s) stockée(s) localement sur cet appareil.
            </p>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
              onClick={() => {
                clearHistory();
                setCount(0);
                toast.success("Historique effacé");
              }}
            >
              <Trash2 className="size-4" />
              Effacer l'historique
            </button>
          </Row>
        </Section>
      </div>
    </div>
  );
}
