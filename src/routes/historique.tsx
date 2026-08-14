import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Copy, Check } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
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
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("Tous");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => setItems(getHistory()), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) =>
        (filter === "Tous" || i.platform === filter) &&
        (!q ||
          `${i.title} ${i.brand} ${i.type} ${i.color}`.toLowerCase().includes(q)),
    );
  }, [items, query, filter]);

  return (
    <div className="pb-6">
      <AppHeader title="Historique" subtitle={`${items.length} annonce(s) enregistrée(s)`} />
      <div className="app-container space-y-4 py-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une annonce"
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {["Tous", ...PLATFORMS].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFilter(p)}
              className={
                filter === p
                  ? "shrink-0 rounded-full border border-primary bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
                  : "shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
              }
            >
              {p}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucune annonce pour le moment.
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="flex gap-3 rounded-xl border border-border bg-card p-3"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="size-16 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="size-16 shrink-0 rounded-lg bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.platform} · {item.prices.recommended} € ·{" "}
                    {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <div className="mt-2 flex gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-medium text-primary"
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          `${item.title}\n\n${item.description}`,
                        );
                        setCopiedId(item.id);
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
    </div>
  );
}
