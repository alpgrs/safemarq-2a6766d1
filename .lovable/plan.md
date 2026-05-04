
# Landing page premium SAFEMARQ — "Sérieux, on lance"

Objectif : transformer la home actuelle (qui est un outil de recherche) en **landing de lancement** capable de convertir 3 audiences à la fois (automobilistes, garagistes, presse/curieux), tout en gardant l'outil de recherche accessible immédiatement.

## Principe directeur

On garde la barre de recherche en haut (c'est le cœur produit), mais on **enrobe** la page d'une vraie narration de marque : hero éditorial, preuve sociale, méthode, sections audience, CTA finaux. Aujourd'hui la home jette l'utilisateur direct dans la grille — ça marche pour un user qui sait, pas pour un visiteur qui découvre.

## Structure de la nouvelle home

```text
┌─────────────────────────────────────────┐
│ 1. HERO éditorial + recherche live      │  ← refonte SearchHero
│ 2. Bandeau "trust strip" (chiffres)     │  ← nouveau
│ 3. Section "Comment ça marche" (3 étapes)│ ← nouveau
│ 4. Carte + résultats (l'outil actuel)   │  ← conservé, retitré
│ 5. "Le score SAFEMARQ" (méthode)        │  ← nouveau, lien /about
│ 6. Témoignages / avis vedettes          │  ← nouveau
│ 7. Split CTA : Automobilistes | Pros    │  ← nouveau
│ 8. FAQ courte (4-5 questions)           │  ← nouveau
│ 9. Footer (existant)                    │
└─────────────────────────────────────────┘
```

## Détail des nouvelles sections

### 1. Hero refondu (`HeroLaunch.tsx`)
- Headline plus fort, en français, pleine largeur : « Le garage de confiance, **vérifié par les vrais conducteurs.** »
- Sous-titre court qui positionne : comparateur indépendant Belgique.
- Barre de recherche XL centrée (réutilise la logique de `SearchHero` actuelle, suggestions incluses).
- Bouton secondaire « Me géolocaliser » à côté.
- Fond : dégradé subtil bleu nuit + halo `trust-glow` derrière le logo, particules statiques douces (pas d'animation lourde).
- Mention micro sous la barre : « Gratuit • Sans inscription • 🇧🇪 ».

### 2. Trust strip (`TrustStrip.tsx`)
Bande horizontale entre hero et carte, 4 chiffres animés (count-up via framer-motion) :
- Nombre de garages référencés (depuis `useGarages`)
- Nombre d'avis vérifiés (agrégé via Supabase count)
- Note moyenne plateforme
- « 100% indépendant »

### 3. Comment ça marche (`HowItWorks.tsx`)
3 cartes alignées, icônes Lucide cohérentes :
1. **Cherchez** — ville ou marque
2. **Comparez** — score SAFEMARQ, avis, devis
3. **Choisissez** — réservez ou demandez un devis

### 4. Outil de recherche existant
On conserve `HomeMap` + `ComparisonEngine` + `ReviewCards` + `QuoteComparator`, mais on ajoute un **titre de section** (« Explorez les garages près de chez vous ») et on ajuste les espacements.

### 5. Section méthode (`MethodSection.tsx`)
- Visuel à gauche (formule du score SAFEMARQ illustrée : 60% note + 40% volume).
- Texte à droite : pourquoi c'est plus juste qu'une simple moyenne Google.
- CTA : « Lire notre méthode complète » → `/about`.

### 6. Témoignages (`Testimonials.tsx`)
- 3 cartes de témoignages (placeholders crédibles au lancement, à remplacer par de vrais avis).
- Format : photo/initiales, citation, nom + ville + véhicule.
- Slide horizontal sur mobile.

### 7. Split CTA (`SplitCTA.tsx`)
Deux gros blocs côte à côte (mobile : empilés) :
- **Gauche — Automobilistes** : « Trouvez votre garage » → scroll vers la carte.
- **Droite — Garagistes** : « Revendiquez votre fiche » → `/pro`.
Chacun avec un visuel/icon distinct et un bénéfice court.

### 8. FAQ (`FaqSection.tsx`)
Accordion shadcn, 5 questions :
- Comment SAFEMARQ choisit-il les garages ?
- Comment vérifiez-vous les avis ?
- Est-ce gratuit ?
- Comment fonctionne le score SAFEMARQ ?
- Je suis garagiste, comment apparaître ?

## Détails techniques

- **Nouveaux fichiers** dans `src/components/landing/` :
  `HeroLaunch.tsx`, `TrustStrip.tsx`, `HowItWorks.tsx`, `MethodSection.tsx`, `Testimonials.tsx`, `SplitCTA.tsx`, `FaqSection.tsx`.
- **`src/pages/Index.tsx`** réorganisé pour orchestrer ces sections dans l'ordre ci-dessus. La logique de filtres/recherche reste, juste déplacée sous le hero.
- **`SearchHero.tsx`** est remplacé par `HeroLaunch.tsx` (on garde la logique suggestions, on jette les "trust indicators" dupliqués).
- **Animations** : `framer-motion` (déjà utilisé) — fade-up à l'apparition (`whileInView`), count-up custom pour les stats. Aucune nouvelle dépendance.
- **Stats dynamiques** : nouveau hook `useLandingStats()` qui fait `count` sur `garages` et `reviews` via Supabase (`select('*', { count: 'exact', head: true })`). React Query, cache 5 min.
- **Composant FAQ** : utilise `@/components/ui/accordion` déjà présent.
- **Responsive** : mobile-first, 1 colonne sous `md`, 2-3 colonnes au-dessus. Hero passe de 60vh (mobile) à 80vh (desktop).
- **SEO** : enrichir le `jsonLd` dans `Index.tsx` avec un objet `Organization` (nom, logo, sameAs vides pour l'instant) en plus du `WebSite` existant.
- **Pas de changement backend** : aucune migration, aucun edge function.

## Hors scope (pour plus tard)

- Vraies vidéos/photos hero (placeholders propres pour l'instant).
- Logos presse / "ils parlent de nous".
- A/B testing.
- Animations Lottie.

## Livrable

Une seule itération qui livre les 7 nouveaux composants + l'`Index.tsx` réorganisé. Build vérifié, responsive testé mentalement aux breakpoints mobile/tablet/desktop.
