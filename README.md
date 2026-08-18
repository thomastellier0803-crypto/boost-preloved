# Resell AI Pro

CRÉATION COMPLÈTE (PRODUIT FINI) : Crée "ResellBoost AI", une application SaaS mobile-first (qualité Play Store / App Store) dédiée à la revente de vêtements d'occasion sur Vinted, Leboncoin et Vestiaire Collective.

---

### 1. DIRECTION ARTISTIQUE & DESIGN (STYLE SAAS PREMIUM)

- ESTHÉTIQUE STRICTE : Design sobre, professionnel et épuré (inspiré de Vinted, Apple et Stripe). INTERDICTION ABSOLUE d'utiliser des emojis dans l'interface, les boutons, les titres ou les cartes. Utiliser uniquement des icônes vectorielles simples (Lucide Icons).

- CHARTE GRAPHIQUE : Tons neutres (ardoise, gris, blanc, noir) avec une seule couleur d'accent professionnelle (ex. vert d'eau ou bleu nuit). Aucun dégradé flashy/violet style "outil IA".

- NAVIGATION : Barre de navigation fixe en bas de l'écran (Bottom Navigation Bar) avec 5 onglets :

  1. [Scanner] - Module principal d'importation et d'analyse photo.

  2. [Historique] - Galerie des annonces générées, enregistrées en LocalStorage, avec recherche et filtres.

  3. [Marge] - Calculateur de bénéfice net (Prix d'achat - Prix de vente = Gain net).

  4. [Pro] - Page de présentation de l'abonnement Freemium avec grille tarifaire.

  5. [Réglages] - Thème d'affichage, préférences par défaut et gestion des données.

---

### 2. MODULE PHOTO & ANALYSE GEMINI VISION

- Zone de dépôt/prise de vue permettant d'importer jusqu'à 4 photos :

  1. Face (Vue globale)

  2. Étiquette (Marque, taille, composition)

  3. Dos

  4. Zoom (Détail, usure ou défaut)

- L'API Gemini Vision analyse les visuels pour extraire :

  * Type de vêtement, marque, couleur principale, coupe (Regular, Slim, Cargo...).

  * Matière et composition détectées sur l'étiquette (ex: 100 % coton).

  * Signatures d'usures, taches ou bouloches avec signalement automatique dans la description.

---

### 3. SÉLECTEURS ET AUTO-COMPLÉTION

- Menu déroulant avec recherche dynamique (Combobox) incluant les 60 marques majeures sur Vinted (Nike, Adidas, Zara, Carhartt, Levi's, Jack & Jones, Ralph Lauren, Lacoste, Celio, H&M, Supreme, Stüssy, Salomon, New Balance, Stone Island, etc.) + option "Saisir une marque".

- Sélecteurs fluides : Catégorie/Sous-catégorie, Taille (XS à 3XL / Pointures) et État (Neuf avec étiquette, Très bon état, Bon état, Satisfaisant).

---

### 4. ALGORITHME DE PRIX & EXPÉDITION (VINTED FRANCE)

Instruction stricte envoyée à l'API Gemini :

- Estimation basée STRICTEMENT sur le marché d'occasion réel en France :

  * Fast-fashion / Prêt-à-porter (Zara, Jack & Jones, Celio, H&M) : Short, T-shirt ou pantalon d'occasion = 3 € à 8 € max.

  * Sportswear / Streetwear (Nike, Adidas, Levi's, Carhartt) = 8 € à 20 €.

  * Pièces rares / Vintage haut de gamme = 25 € à 60 €+.

- Affichage de 3 cartes de prix :

  1. "Vente Rapide (1-3 jours)"

  2. "Prix Recommandé (Moyenne Vinted)"

  3. "Prix Max (État parfait)"

- FORMAT DE COLIS : Indique le format Vinted recommandé (Petit < 500 g, Moyen < 1 kg, Grand < 2 kg).

---

### 5. GÉNÉRATION MULTI-PLATEFORMES & EXPORT

- Sélecteur de format : [Vinted] | [Leboncoin] | [Vestiaire Collective].

- Résultat généré :

  * Titre optimisé (ex: "Short Cargo Jack & Jones Gris Taille M").

  * Description propre et structurée sans aucun emoji par défaut.

  * Bloc de hashtags ciblés.

- Boutons d'action : "Copier le titre", "Copier la description", "Copier les hashtags" et "Tout copier" avec confirmation visuelle ("Copié !").

---

### 6. FREEMIUM & PAYWALL

- Compteur de crédits quotidiens en haut de l'écran (ex: "2 / 3 annonces gratuites").

- Fenêtre modale "ResellBoost Pro" (4,99 € / mois) au-delà du quota pour débloquer les générations illimitées.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f42ab2b4-b373-42d8-a321-a2a6d92d8577).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
