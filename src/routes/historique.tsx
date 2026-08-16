import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Copy, Check, PackageOpen, Camera } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/Chip";
import { getHistory, removeHistory } from "@/lib/local-store";
import { PLATFORMS, type HistoryItem } from "@/lib/resell-data";

export const Route = createFileRoute("/historique")({
  head: () => ({
    meta: [
      { title: "Historique des annonces — ResellBoost AI" },
      {
        name: "description",
        content: "Retrouvez, filtrez et recopiez toutes vos annonces générées.",
      },
      { property: "og:title", content: "Historique des annonces — ResellBoost AI" },
      {
        property: "og:description",
        content: "Vos annonces générées, sauvegardées sur votre appareil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("Tous");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setItems(getHistory());
    setReady(true);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) =>
        (filter === "Tous" || i.platform === filter) &&
        (!q || `${i.title} ${i.brand} ${i.type} ${i.color}`.toLowerCase().includes(q)),
    );
  }, [items, query, filter]);

  return (
    <div className="pb-6">
      <AppHeader title="Historique" subtitle={`${items.length} annonce(s) enregistrée(s)`} />
      <div className="app-container space-y-4 py-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une annonce"
            className="h-12 rounded-2xl border-border bg-card pl-11 shadow-card focus-visible:ring-primary/40"
          />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {["Tous", ...PLATFORMS].map((p) => (
            <Chip
              key={p}
              active={filter === p}
              onClick={() => setFilter(p)}
              className="shrink-0 whitespace-nowrap"
            >
              {p}
            </Chip>
          ))}
        </div>

        {!ready ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="shimmer h-24 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
              <PackageOpen className="size-8" strokeWidth={1.5} />
            </span>
            <p className="text-base font-semibold">Votre stock est vide</p>
            <p className="max-w-[16rem] text-sm text-muted-foreground">
              Scannez un vêtement pour générer votre première annonce optimisée.
            </p>
            <Link
              to="/"
              className="cta-glow mt-1 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            >
              <Camera className="size-4" />
              Scanner mon premier article
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((item) => {
              const upside = item.prices.max - item.prices.recommended;
              return (
                <li key={item.id} className="glass-card flex gap-3 p-3">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="size-20 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="size-20 shrink-0 rounded-xl bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{item.title}</p>
                      <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                        {item.platform === "Vestiaire Collective" ? "Vestiaire" : item.platform}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-lg font-semibold tracking-tight">
                        {item.prices.recommended} €
                      </span>
                      <span
                        className={
                          upside > 0
                            ? "rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success"
                            : "rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive"
                        }
                      >
                        {upside > 0 ? `+${upside} € max` : "prix plafond"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")} · Colis {item.parcel}
                    </p>
                    <div className="mt-2 flex gap-3">
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs font-semibold text-primary"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            `${item.title}\n\n${item.description}`,
                          );
                          setCopiedId(item.id);
                          toast.success("Copié dans le presse-papier");
                          setTimeout(() => setCopiedId(null), 1600);
                        }}
                      >
                        {copiedId === item.id ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        {copiedId === item.id ? "Copié !" : "Copier"}
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground"
                        onClick={() => {
                          removeHistory(item.id);
                          setItems(getHistory());
                          toast.success("Annonce supprimée");
                        }}
                      >
                        <Trash2 className="size-3.5" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
