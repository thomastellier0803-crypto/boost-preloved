export const BRANDS = [
  "Nike",
  "Adidas",
  "Zara",
  "Carhartt",
  "Levi's",
  "Jack & Jones",
  "Ralph Lauren",
  "Lacoste",
  "Celio",
  "H&M",
  "Supreme",
  "Stüssy",
  "Salomon",
  "New Balance",
  "Stone Island",
  "The North Face",
  "Patagonia",
  "Columbia",
  "Puma",
  "Reebok",
  "Vans",
  "Converse",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Guess",
  "Diesel",
  "Pull & Bear",
  "Bershka",
  "Stradivarius",
  "Mango",
  "Uniqlo",
  "Kiabi",
  "Jules",
  "Bizzbee",
  "Brice",
  "Pimkie",
  "Sandro",
  "Maje",
  "The Kooples",
  "Zadig & Voltaire",
  "Ba&sh",
  "Sézane",
  "Comptoir des Cotonniers",
  "Naf Naf",
  "Morgan",
  "Kaporal",
  "Teddy Smith",
  "Schott",
  "Timberland",
  "Dr. Martens",
  "Napapijri",
  "Helly Hansen",
  "Ellesse",
  "Fila",
  "Champion",
  "Umbro",
  "Kappa",
  "Lee",
  "Wrangler",
  "Superdry",
  "Asics",
  "Under Armour",
  "Obey",
  "Element",
  "Quiksilver",
  "Billabong",
  "Von Dutch",
  "Burberry",
  "Moncler",
  "Canada Goose",
] as const;

export const CATEGORIES: Record<string, string[]> = {
  Haut: ["T-shirt", "Chemise", "Polo", "Pull", "Sweat", "Hoodie", "Gilet", "Débardeur"],
  Bas: ["Jean", "Pantalon", "Chino", "Jogging", "Short", "Cargo", "Jupe"],
  Veste: ["Veste légère", "Blouson", "Doudoune", "Manteau", "Parka", "Coupe-vent", "Cuir"],
  Robe: ["Robe courte", "Robe longue", "Combinaison"],
  Chaussures: ["Baskets", "Bottes", "Sandales", "Mocassins", "Chaussures de ville"],
  Accessoire: ["Sac", "Ceinture", "Casquette", "Bonnet", "Écharpe", "Montre"],
};

export const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
export const SHOE_SIZES = Array.from({ length: 15 }, (_, i) => String(34 + i));

export const CONDITIONS = [
  "Neuf avec étiquette",
  "Neuf sans étiquette",
  "Très bon état",
  "Bon état",
  "Satisfaisant",
] as const;

export const FITS = ["Regular", "Slim", "Oversize", "Cargo", "Straight", "Baggy", "Skinny", "Droite"];

export const PLATFORMS = ["Vinted", "Leboncoin", "Vestiaire Collective"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PHOTO_SLOTS = [
  { key: "face", label: "Face", hint: "Vue globale" },
  { key: "etiquette", label: "Étiquette", hint: "Marque, taille" },
  { key: "dos", label: "Dos", hint: "Vue arrière" },
  { key: "zoom", label: "Zoom", hint: "Détail, usure" },
] as const;

export type AnalysisResult = {
  type: string;
  brand: string;
  color: string;
  fit: string;
  material: string;
  size: string;
  condition: string;
  defects: string[];
  parcel: "Petit" | "Moyen" | "Grand";
  parcelNote: string;
  prices: { quick: number; recommended: number; max: number };
  title: string;
  description: string;
  hashtags: string[];
  platform: Platform;
};

export type HistoryItem = AnalysisResult & {
  id: string;
  createdAt: number;
  thumbnail?: string | undefined;
};
