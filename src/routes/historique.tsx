import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Copy,
  Check,
  PackageOpen,
  Camera,
  Lightbulb,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/Chip";
import { ResultPanel } from "@/components/ResultPanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getHistory, removeHistory } from "@/lib/local-store";
import { usePro } from "@/hooks/use-pro";
import { ProTools } from "@/components/ProTools";
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

function platformTip(platform: string) {
  switch (platform) {
    case "Leboncoin":
      return "Soyez réactif aux messages et proposez un envoi suivi ou une remise en main propre.";
    case "Vestiaire Collective":
      return "Mettez en avant l'authenticité, la composition et l'état général du vêtement.";
    case "Vinted":
    default:
      return "Prenez des photos en lumière naturelle et renseignez bien la marque et l'état.";
  }
}

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("Tous");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const pro = usePro();

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

  const dormant = useMemo(
    () => items.reduce((sum, i) => sum + i.prices.recommended, 0),
    [items],
  );

  function updateSelected(next: HistoryItem) {
    setSelectedItem(next);
    setItems(getHistory());
  }

  function openDetail(item: HistoryItem) {
    setSelectedItem(item);
    setDialogOpen(true);
  }

  function closeDetail() {
    setDialogOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  }

  return (
    <div className="pb-6">
      <AppHeader title="Historique" subtitle={`${items.length} annonce(s) enregistrée(s)`} />
      <div className="app-container space-y-4 py-5">
        <div className="glass-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Capital dormant
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {dormant} € <span className="text-sm font-medium">bloqués dans ton armoire</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Total estimé de tes {items.length} article(s) non vendus.
          </p>
          {!pro ? (
            <Link
              to="/pro"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/30 bg-accent p-3 transition-transform active:scale-[0.98]"
            >
              <Crown className="size-5 shrink-0 text-primary" />
              <span className="text-xs font-semibold text-accent-foreground">
                Passe à l'Offre Pro pour débloquer la visibilité SEO et vendre ton stock 3x plus
                vite.
              </span>
            </Link>
          ) : (
            <p className="mt-4 rounded-2xl border border-primary/30 bg-accent p-3 text-xs font-semibold text-accent-foreground">
              Offre Pro active : Boost SEO, Relanceur Favoris et Re-publication débloqués.
            </p>
          )}
        </div>

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
            {filtered.map((item) => (
              <li
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={`Ouvrir le détail de ${item.title}`}
                className="glass-card flex cursor-pointer gap-3 p-3 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                onClick={() => openDetail(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetail(item);
                  }
                }}
              >
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
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Cote Vinted estimée : {item.prices.quick} € - {item.prices.max} €
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("fr-FR")} · Colis {item.parcel}
                  </p>
                  <div className="mt-2 flex gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-semibold text-primary"
                      onClick={async (e) => {
                        e.stopPropagation();
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
                      onClick={(e) => {
                        e.stopPropagation();
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
            ))}
          </ul>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-0"
          onPointerDownOutside={closeDetail}
        >
          {selectedItem && (
            <>
              {selectedItem.thumbnail ? (
                <img
                  src={selectedItem.thumbnail}
                  alt={selectedItem.title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 w-full items-center justify-center bg-muted">
                  <PackageOpen className="size-12 text-muted-foreground" strokeWidth={1.5} />
                </div>
              )}
              <div className="px-5 pb-6 pt-2">
                <DialogHeader className="text-left">
                  <div className="flex items-start justify-between gap-3">
                    <DialogTitle className="text-base font-semibold leading-snug">
                      {selectedItem.title}
                    </DialogTitle>
                    <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                      {selectedItem.platform === "Vestiaire Collective"
                        ? "Vestiaire"
                        : selectedItem.platform}
                    </span>
                  </div>
                  <DialogDescription>
                    {new Date(selectedItem.createdAt).toLocaleDateString("fr-FR")} · Colis{" "}
                    {selectedItem.parcel}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                  <ResultPanel result={selectedItem} />
                </div>

                <ProTools item={selectedItem} pro={pro} onUpdate={updateSelected} />

                <div className="mt-5 flex gap-3 rounded-2xl border border-border bg-accent/50 p-4">
                  <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Conseil de publication</p>
                    <p className="text-sm text-muted-foreground">
                      {platformTip(selectedItem.platform)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
