import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  images: z.array(z.string()).min(1).max(4),
  platform: z.string(),
  brand: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  size: z.string().optional(),
  condition: z.string().optional(),
});

const outputSchema = z.object({
  type: z.string().default(""),
  category: z.string().default(""),
  subcategory: z.string().default(""),
  brand: z.string().default(""),
  color: z.string().default(""),
  fit: z.string().default(""),
  material: z.string().default(""),
  size: z.string().default(""),
  condition: z.string().default(""),
  defects: z.array(z.string()).default([]),
  wearDetected: z.boolean().default(false),
  wearNote: z.string().default(""),
  suggestedCondition: z.string().default(""),
  parcel: z.string().default("Moyen"),
  parcelNote: z.string().default(""),
  prices: z
    .object({
      quick: z.number().default(0),
      recommended: z.number().default(0),
      max: z.number().default(0),
    })
    .default({ quick: 0, recommended: 0, max: 0 }),
  title: z.string().default(""),
  description: z.string().default(""),
  hashtags: z.array(z.string()).default([]),
});

const SYSTEM = `Tu es un expert de la revente de vêtements d'occasion en France (Vinted, Leboncoin, Vestiaire Collective).
Tu analyses des photos de vêtements et tu produis une fiche d'annonce prête à publier.

RÈGLES DE PRIX (prix RÉELS de vente sur Vinted France, en euros, sois volontairement conservateur) :
- Entrée de gamme / marques distributeur / grande surface (Firefly, In Extenso, Domyos, Décathlon, Kiabi, Tex, Lupilu, Primark, C&A, Gémo, Shein...) ou vêtement visiblement usé : recommandé 3 à 5 € MAXIMUM. Jamais 7 ou 8 €.
- Fast-fashion classique (Zara, H&M, Jack & Jones, Celio, Pull & Bear, Bershka, Jules...) : 4 à 8 €.
- Sportswear / streetwear (Nike, Adidas, Levi's, Carhartt, New Balance, Vans...) : 8 à 20 €.
- Pièces rares, vintage haut de gamme, luxe (Stone Island, Supreme, Burberry, Moncler...) : 25 à 60 € et plus.
Le prix "quick" est le prix de vente rapide en 48 h (environ 60 à 70 % du recommandé, minimum 2 €), "max" ne dépasse jamais le recommandé + 40 %.
Baisse encore le prix si l'état est moyen, si le tissu est délavé, bouloché ou si des défauts sont visibles. Un prix trop haut ne se vend pas : privilégie toujours le réalisme.

DÉTECTION D'USURE (anti-litige) :
- Observe attentivement le tissu : bouloches, délavage, col détendu, tache, trou, semelle usée, jaunissement.
- Si une usure visuelle est détectée, mets wearDetected à true, décris-la brièvement dans wearNote, et indique dans suggestedCondition l'état honnête conseillé ("Satisfaisant" ou "Bon état").
- Si rien n'est détecté, wearDetected = false, wearNote = "" et suggestedCondition = "".

CLASSIFICATION (obligatoire, utilise EXACTEMENT ces valeurs) :
- category : Haut | Bas | Veste | Robe | Chaussures | Accessoire
- subcategory : une valeur cohérente (T-shirt, Chemise, Polo, Pull, Sweat, Hoodie, Gilet, Débardeur, Jean, Pantalon, Chino, Jogging, Short, Cargo, Jupe, Veste légère, Blouson, Doudoune, Manteau, Parka, Coupe-vent, Cuir, Robe courte, Robe longue, Combinaison, Baskets, Bottes, Sandales, Mocassins, Chaussures de ville, Sac, Ceinture, Casquette, Bonnet, Écharpe, Montre)
- condition : Neuf avec étiquette | Neuf sans étiquette | Très bon état | Bon état | Satisfaisant
- size : adulte (XS, S, M, L, XL, 2XL, 3XL), pointure (34 à 48) ou taille enfant au format exact "14 ans (164 cm)".

FORMAT DE COLIS VINTED : Petit (< 500 g), Moyen (< 1 kg), Grand (< 2 kg).

RÉDACTION :
- Aucun emoji, jamais, nulle part.
- Titre court et optimisé : Type + Marque + Couleur + Taille.
- Description structurée, factuelle, en français, mentionnant marque, taille, matière/composition, coupe, état, et signalant honnêtement toute usure, tache ou bouloche détectée.
- Adapte le ton au format demandé :
  * Vinted : concis, mots-clés, hashtags utiles.
  * Leboncoin : annonce classique, aucun hashtag dans la description, ton local et pratique.
  * Vestiaire Collective : premium, axé sur la composition exacte, la marque, l'authenticité et l'état détaillé, aucun hashtag.
- 8 à 12 hashtags pertinents sans le caractère # (ils ne seront utilisés que pour Vinted).

Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format :
{"type":"","category":"","subcategory":"","brand":"","color":"","fit":"","material":"","size":"","condition":"","defects":[],"parcel":"Petit|Moyen|Grand","parcelNote":"","prices":{"quick":0,"recommended":0,"max":0},"title":"","description":"","hashtags":[]}`;

export const analyzeGarment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Clé IA manquante");

    const hints = [
      `Plateforme cible : ${data.platform}.`,
      data.brand ? `Marque indiquée par le vendeur : ${data.brand}.` : "",
      data.category ? `Catégorie : ${data.category} ${data.subcategory ?? ""}.` : "",
      data.size ? `Taille indiquée : ${data.size}.` : "",
      data.condition ? `État indiqué : ${data.condition}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyse ces photos (ordre : face, étiquette, dos, zoom détail) et génère la fiche. ${hints}`,
              },
              ...data.images.map((url) => ({ type: "image_url", image_url: { url } })),
            ],
          },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Trop de requêtes, réessayez dans un instant.");
    if (res.status === 402) throw new Error("Crédits IA épuisés.");
    if (!res.ok) throw new Error(`Analyse impossible (${res.status})`);

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Réponse IA illisible");
    return outputSchema.parse(JSON.parse(match[0]));
  });
