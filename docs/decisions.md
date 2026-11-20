# Journal des décisions

Chaque entrée indique **ce qui a été décidé**, **pourquoi**, et **ce qu'on a écarté**. Les entrées les plus récentes sont en bas.

---

## D1. Un monorepo avec les workspaces npm (20/11/2026)

- **Décision** : un seul dépôt `lauradimitroff/tablee`, avec `apps/web` (Angular) et `apps/api` (NestJS).
- **Pourquoi** : une seule CI, des types partagés entre le front et l'API, et un seul lien à présenter dans le portfolio.
- **Écarté** : deux dépôts séparés (CI et types en double) ; Nx (trop de configuration et de « magie » pour un premier projet Angular et NestJS).

## D2. Des parties et des scores en version allégée dans la V1 (20/11/2026)

- **Décision** : on enregistre les parties (gagnant, scores facultatifs) et on affiche 4 statistiques au maximum, sous forme de cartes.
- **Pourquoi** : ça boucle le cycle « organiser → jouer → se souvenir », qui fait le côté ludique de l'appli.
- **Écarté** : reporter en V2 (l'appli n'aurait pas de « fin ») ; une version complète avec graphiques (on retomberait dans un dashboard façon Atollo).

## D3. Connexion par e-mail et mot de passe, avec un JWT dans un cookie httpOnly (20/11/2026)

- **Décision** : l'authentification est codée dans NestJS (hachage argon2, JWT, guards).
- **Pourquoi** : c'est le plus formateur pour un premier backend, et ça ne demande aucun service d'envoi d'e-mails.
- **Écarté** : le lien magique (il faut un service d'e-mails) ; OAuth (le cœur de l'authentification est délégué à un fournisseur).
- **Conséquence** : pas de « mot de passe oublié » en V1. C'est une limite assumée.

## D4. La direction artistique « Ludothèque chaleureuse » (20/11/2026)

- **Décision** : papier crème, bois et kraft, terracotta et vert sapin, titres en serif doux.
- **Écarté** : « Boîte de jeu pop » et « Nuit de jeu ».

## D5. Les règles de fonctionnement (20/11/2026)

- Un utilisateur peut appartenir à **plusieurs tablées**, grâce à une table de liaison `Membre` qui porte le rôle.
- Deux rôles seulement : **hôte** et **membre**.
- Les **jeux appartiennent aux utilisateurs**. La ludothèque d'une tablée réunit les jeux de ses membres.
- Le **sondage de dates** se termine quand l'organisateur fixe la date. Il n'y a pas de clôture automatique, donc pas de tâche planifiée.
- L'**invitation** passe par un code réutilisable par tablée, que l'hôte peut régénérer.
- Le **vote des jeux** se fait par classement, avec des points selon le rang (méthode de Borda), mis à jour en temps réel par WebSocket.

## D6. Validation du cahier des charges (20/11/2026)

- **Décision** : les points ouverts sont acceptés tels que proposés.
  - L'hôte ne peut pas quitter sa tablée, mais il peut la supprimer.
  - La liste des catégories de jeux reste celle proposée.
  - Seuls les jeux des participants sont proposés au vote.
  - Chaque participant classe au plus 5 jeux (méthode de Borda, de 5 à 1 point).
  - Les 4 statistiques retenues sont : champion·ne, jeu fétiche, esprit d'équipe, jeu oublié.
- **Pourquoi** : ce sont des règles simples, faciles à expliquer dans l'interface, qui gardent la V1 courte.

## D7. La direction artistique et le slogan (20/11/2026)

- **Décision** : on adopte la direction « Ludothèque chaleureuse », présentée dans `docs/direction-artistique.html`.
  - **Couleurs** : papier, carton, encre (brou de noix), vert sapin, terre cuite, miel, kraft. Le miel et le kraft ne portent jamais de texte en mode clair.
  - **Typographies** : Young Serif pour les titres, Atkinson Hyperlegible Next pour le texte, Atkinson Hyperlegible Mono pour les scores.
  - **Signature** : des fiches et des boutons avec une « tranche » de carton pleine (une ombre nette de 3 px), des angles de 6 px, sans flou.
  - **Thème sombre** : une table de nuit éclairée par une lampe, avec des couleurs réajustées pour garder le contraste.
- **Slogan** : « Tablée · soirées jeux ».
- **Pourquoi** : cette direction est tirée de l'univers du jeu de société (boîtes, livrets de règles, pions). Elle s'oppose à Pocki (gris froid, bleu marine, Inter, grands arrondis) et à Atollo (dashboard).
- **Écarté** : les slogans « Vos soirées jeux, sans le casse-tête » et « Qui vient, et on joue à quoi ? ».

## D8. L'architecture (20/11/2026)

Le détail se trouve dans `docs/architecture.md`.

- **Sessions stockées en base, pas de JWT de session.**
  - Pourquoi : une seule API et une seule base, et la déconnexion supprime vraiment la session.
  - Le JWT sert seulement au ticket WebSocket, valable 60 secondes.
- **Proxy Vercel.** Les rewrites `/api/*` envoient vers Render, donc le cookie est servi par le même site. Le WebSocket se connecte directement à Render, avec le ticket.
- **Render en offre gratuite.** La mise en veille est couverte par un écran d'attente. On réexaminera ce choix à l'étape 8.
- **Langues.** Le code est en anglais, l'interface en français. `Tablee` reste tel quel, c'est le nom du produit.
- **Temps réel avec Socket.IO.** Les écritures passent en REST ; le WebSocket ne fait que prévenir les autres participants.
- **CSS maison**, avec les jetons du livret de DA, sans Angular Material ni Tailwind.
- **Écartés** :
  - Nx et Turborepo ;
  - le rendu serveur (SSR) ;
  - NgRx ;
  - GraphQL ;
  - Docker en local ;
  - l'API en serverless sur Vercel, qui ne gère pas les WebSockets.

## D9. TypeScript 6.0, version fixée (20/11/2026)

- **Décision** : `typescript` est fixé à la version exacte 6.0.x à la racine du monorepo.
- **Pourquoi** : TypeScript 7 (la réécriture en Go) est la version par défaut sur npm, mais Angular 22 exige `>=6.0 <6.1` et la CLI NestJS 12 utilise `~6.0`. Une seule version pour tout le dépôt évite les doublons et les erreurs de compilation.
- **À revoir** : quand Angular et NestJS prendront en charge TypeScript 7.

## D10. Le socle Angular (20/11/2026)

- **Décision** : Angular 22, généré avec la CLI, en mode zoneless, avec Vitest et sans SSR. Le préfixe des composants est `tb-`.
- **Polices auto-hébergées** avec Fontsource, au lieu de Google Fonts.
  - Pourquoi : aucune requête vers Google, donc pas de transfert de l'adresse IP des visiteurs (RGPD). Le site ne dépend pas non plus d'un service tiers.
- **Jetons de la DA** en variables CSS (`src/styles/tokens.css`), avec le thème sombre selon le réglage du système.
- **Configuration héritée** : le projet Angular reprend les règles TypeScript de `tsconfig.base.json`, plus `strictTemplates`, qui vérifie aussi les types dans les gabarits HTML.
