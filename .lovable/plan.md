# Plan de finalisation Trustmarq — Route vers le lancement

On va avancer par phases courtes et livrables. Je propose qu'on commence **maintenant** par la Phase 1 (la base indispensable pour publier sereinement), puis on enchaîne.

## Phase 1 — Socle de lancement (on commence ici)

Ce sont les briques sans lesquelles on ne peut pas publier proprement.

1. **Robustesse**
   - `ErrorBoundary` global + page d'erreur stylée
   - États vides soignés (recherche, avis, devis, véhicules, favoris)
   - Skeletons cohérents partout

2. **SEO & partage**
   - Composant `<Seo />` réutilisable (titres, meta, Open Graph) sur toutes les pages
   - JSON-LD `LocalBusiness` sur les fiches garages
   - `sitemap.xml` généré
   - Manifest PWA + favicon propres

3. **Pages légales (RGPD Belgique)**
   - Mentions légales, CGU, Politique de confidentialité, Cookies
   - Bandeau cookies minimal (analytics opt-in)
   - Page "À propos / Notre méthode" (explique le Trustmarq Score, la vérification des avis → renforce la confiance)

4. **Page publique "Pour les pros"** (`/pro`)
   - Pitch de valeur + CTA vers `/pro/claim`
   - Liens depuis le footer

## Phase 2 — Engagement & confiance

5. **Emails transactionnels** (Lovable Emails) :
   nouveau devis reçu, devis accepté/refusé, réponse à un avis, confirmation de revendication
6. **Centre de notifications in-app** (cloche dans le header, realtime)
7. **Édition de fiche par le garagiste** (description, horaires, photos via Storage)

## Phase 3 — Modération & croissance

8. **Dashboard admin** (`/admin`, rôle `admin`) : revendications en attente, modération avis, CRUD garages
9. **Signalement d'avis** côté public
10. **Stats garagiste** (vues fiche, conversion devis) + export CSV
11. **Analytics privacy-friendly** (Plausible)
12. **Élargissement géographique** (Liège, Charleroi, Bruxelles)

## Détails techniques Phase 1

- `react-helmet-async` pour les meta (à ajouter)
- `ErrorBoundary` placé dans `App.tsx` autour des routes
- Composant `<EmptyState icon title description action />` réutilisable dans `src/components/ui/`
- Pages légales en routes statiques `/legal/*` avec contenu Markdown rendu
- Bandeau cookies via `localStorage` (consent stocké), affichage tant que non répondu
- Sitemap : route `/sitemap.xml` générée côté client à partir des garages (ou statique pour V1)
- Manifest PWA : `public/manifest.webmanifest` + meta tags dans `index.html`
- JSON-LD : injecté via `<Seo />` sur `GarageDetail` avec rating, address, phone, openingHours

## Estimation

Phase 1 = un seul gros run de ma part. Phases 2 et 3 = plusieurs itérations chacune (notamment les emails et l'admin).

## Question

Pour la Phase 1, tu veux :

- **A. On y va tel quel** — je livre les 4 sujets de la Phase 1 dans la foulée.
- **B. On retire la page "À propos / Notre méthode"** (à faire plus tard, tu rédigeras peut-être le texte toi-même).
- **C. Tu veux d'abord modifier l'ordre** — dis-moi ce que tu veux prioriser ou retirer.

Réponds A / B / C et j'attaque dès l'approbation du plan.
