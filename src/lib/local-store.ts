import type { HistoryItem } from "./resell-data";

const HISTORY_KEY = "rb_history";
const CREDITS_KEY = "rb_credits";
const PREFS_KEY = "rb_prefs";

export const FREE_QUOTA = 3;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export function getHistory(): HistoryItem[] {
  return read<HistoryItem[]>(HISTORY_KEY, []);
}

export function addHistory(item: HistoryItem) {
  write(HISTORY_KEY, [item, ...getHistory()].slice(0, 100));
}

export function removeHistory(id: string) {
  write(
    HISTORY_KEY,
    getHistory().filter((i) => i.id !== id),
  );
}

export function clearHistory() {
  write(HISTORY_KEY, []);
}

export type Credits = { date: string; used: number };

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getCredits(): Credits {
  const c = read<Credits>(CREDITS_KEY, { date: today(), used: 0 });
  if (c.date !== today()) return { date: today(), used: 0 };
  return c;
}

export function consumeCredit() {
  const c = getCredits();
  const next = { date: today(), used: c.used + 1 };
  write(CREDITS_KEY, next);
  return next;
}

export function resetCredits() {
  write(CREDITS_KEY, { date: today(), used: 0 });
}

export type Prefs = {
  theme: "light" | "dark" | "system";
  platform: string;
  condition: string;
  noEmoji: boolean;
};

export const defaultPrefs: Prefs = {
  theme: "system",
  platform: "Vinted",
  condition: "Très bon état",
  noEmoji: true,
};

export function getPrefs(): Prefs {
  return { ...defaultPrefs, ...read<Partial<Prefs>>(PREFS_KEY, {}) };
}

export function setPrefs(p: Prefs) {
  write(PREFS_KEY, p);
  applyTheme(p.theme);
}

export function applyTheme(theme: Prefs["theme"]) {
  if (typeof document === "undefined") return;
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}
