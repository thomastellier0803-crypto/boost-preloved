import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [prefs, setLocalPrefs] = useState<Prefs>(defaultPrefs);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLocalPrefs(getPrefs());
    setCount(getHistory().length);
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
      <div className="app-container space-y-5 py-5">
        <section className="space-y-4 rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Affichage
          </p>
          <div className="space-y-1.5">
            <Label>Thème</Label>
            <Select value={prefs.theme} onValueChange={(v) => update({ theme: v as Prefs["theme"] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Préférences par défaut
          </p>
          <div className="space-y-1.5">
            <Label>Plateforme</Label>
            <Select value={prefs.platform} onValueChange={(v) => update({ platform: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>État par défaut</Label>
            <Select value={prefs.condition} onValueChange={(v) => update({ condition: v })}>
              <SelectTrigger>
                <SelectValue />
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Descriptions sans emoji</Label>
              <p className="text-xs text-muted-foreground">Texte sobre et professionnel</p>
            </div>
            <Switch
              checked={prefs.noEmoji}
              onCheckedChange={(checked) => update({ noEmoji: checked })}
            />
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Données
          </p>
          <p className="text-sm text-muted-foreground">
            {count} annonce(s) stockée(s) localement sur cet appareil.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              clearHistory();
              setCount(0);
              toast.success("Historique effacé");
            }}
          >
            Effacer l'historique
          </Button>
        </section>
      </div>
    </div>
  );
}
