# Cahier des charges : Tablée

> Version 0.2, du 20/11/2026. Statut : **validé** (sauf la direction artistique, en cours).
> Les points marqués sont des propositions qui n'ont pas encore été tranchées ensemble.

---

## 1. Présentation

**Tablée** est une application web qui aide un groupe d'amis (une _tablée_) à organiser ses soirées de jeux de société et de jeu de rôle :

1. trouver une date qui convient à tout le monde ;
2. voir qui vient ;
3. choisir les jeux en fonction du nombre de présents et du temps disponible ;
4. garder l'historique des parties et des scores.

- **URL** : https://tablee-jeux.vercel.app/
- **Slogan** : « Tablée · soirées jeux ».
- **Cadre** : projet « Lab » du portfolio. C'est un premier projet Angular et un premier backend codé à la main (NestJS).

### 1.1 Objectifs

| Objectif                                                          | Ce que ça implique                                                                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Une appli **ludique**, qui ne ressemble pas à un écran de gestion | Peu d'écrans, beaucoup de soin sur l'interface, une direction artistique chaleureuse                                |
| **Peu de fonctionnalités, mais toutes abouties**                  | Chaque fonctionnalité de la V1 gère ses cas vides, ses erreurs et son chargement, et elle est accessible            |
| Démontrer **Angular** et un **backend sur mesure**                | Signals, formulaires réactifs typés, glisser-déposer du CDK ; API REST + WebSocket, authentification codée soi-même |
| Un projet **défendable en entretien**                             | Chaque choix est consigné dans `docs/decisions.md`                                                                  |

### 1.2 Utilisateurs types

- **Prune, l'organisatrice** : c'est elle qui relance le groupe. Elle veut proposer des dates en 30 secondes et savoir rapidement qui vient.
- **Malik, le collectionneur** : il possède 80 jeux. Il veut que ses jeux soient proposés quand ils conviennent au nombre de présents.
- **Jo, le joueur occasionnel** : il ouvre le lien sur son téléphone, répond « oui » et classe trois jeux. Il ne doit pas avoir besoin de lire une aide.

---

## 2. Périmètre

### 2.1 Dans la V1

1. Comptes (inscription, connexion, déconnexion, profil minimal)
2. Tablées et invitations par lien
3. Ludothèque personnelle, et ludothèque de la tablée qui réunit celles des membres
4. Soirées : sondage de dates, puis confirmation par l'organisateur
5. Vote des jeux par classement, en temps réel
6. Parties, scores et 4 statistiques amusantes

### 2.2 Hors V1 (pistes pour plus tard)

- Mode campagne de jeu de rôle (séances, résumés, personnages)
- Import depuis BoardGameGeek
- Badges
- Réinitialisation du mot de passe par e-mail (voir § 6.3)
- Notifications par e-mail ou push
- Plusieurs hôtes par tablée, transfert du rôle d'hôte
- Traduction (l'interface est uniquement en français)

---

## 3. Fonctionnalités détaillées

Chaque fonctionnalité est décrite par des **récits utilisateur** (« en tant que…, je veux… ») et des **critères d'acceptation** : ces critères serviront de base aux tests.

### F1. Comptes

**Récits**

- En tant que visiteur, je crée un compte avec un e-mail, un pseudo et un mot de passe.
- En tant qu'utilisateur, je me connecte, je reste connecté entre deux visites et je peux me déconnecter.
- En tant qu'utilisateur, je modifie mon pseudo.

**Critères d'acceptation**

- L'e-mail est unique, et il est comparé sans tenir compte des majuscules.
- Le mot de passe fait au moins 10 caractères. Le formulaire indique la règle **avant** l'erreur, pas seulement après.
- Le pseudo fait de 2 à 30 caractères. Il n'a pas besoin d'être unique, puisque c'est le nom affiché dans les tablées.
- En cas d'échec de connexion, le message reste générique (« E-mail ou mot de passe incorrect ») pour ne pas révéler quels e-mails sont inscrits.
- La session dure 7 jours. Les pages privées redirigent vers la connexion, puis ramènent à la page demandée.

### F2. Tablées et invitations

**Récits**

- En tant qu'utilisateur, je crée une tablée (nom, et un emoji ou une couleur en guise d'emblème). J'en deviens l'**hôte**.
- En tant qu'hôte, je copie le lien d'invitation et je le partage où je veux (messagerie, SMS…).
- En tant qu'invité, j'ouvre le lien. Si je n'ai pas de compte, je m'inscris, puis je rejoins la tablée **automatiquement**.
- En tant qu'utilisateur, j'appartiens à plusieurs tablées et je passe de l'une à l'autre.
- En tant qu'hôte, je renomme la tablée, je retire un membre et je régénère le lien (l'ancien ne marche plus).
- En tant que membre, je quitte une tablée.

**Critères d'acceptation**

- Le lien a la forme `/rejoindre/:code`, avec un code aléatoire non devinable (au moins 8 caractères).
- Ouvrir le lien d'une tablée dont on est déjà membre mène simplement à cette tablée.
- L'hôte ne peut pas quitter sa tablée. Il peut en revanche la supprimer, après une confirmation explicite.
- Quand un membre part ou est retiré, ses jeux disparaissent de la ludothèque de la tablée, mais il reste visible dans l'historique des parties, sous le libellé « ancien membre ».

### F3. Ludothèque

**Récits**

- En tant qu'utilisateur, j'ajoute, je modifie et je supprime les jeux de **ma** collection.
- En tant que membre, je consulte la ludothèque de la tablée, je vois **qui possède quoi** et je filtre les jeux.

**Fiche d'un jeu**

| Champ             | Type       | Règle                                                     |
| ----------------- | ---------- | --------------------------------------------------------- |
| Nom               | texte      | obligatoire                                               |
| Joueurs min / max | entiers    | 1 ≤ min ≤ max ≤ 20                                        |
| Durée moyenne     | minutes    | obligatoire, par paliers de 15 min                        |
| Catégorie         | liste fixe | ambiance, stratégie, famille, enquête, jeu de rôle, autre |
| Mode              | liste fixe | compétitif, coopératif                                    |

**Critères d'acceptation**

- On peut filtrer par nombre de joueurs, durée maximale, catégorie et mode, et chercher par nom.
- Si deux membres possèdent le même jeu, il apparaît deux fois, avec chaque propriétaire. Les doublons ne sont pas fusionnés, faute de référentiel commun. Ce sera possible plus tard avec l'import BoardGameGeek.
- L'état vide de la ludothèque invite à ajouter un premier jeu.

### F4. Soirées et sondage de dates

**Récits**

- En tant que membre, je propose une soirée : un titre, de 2 à 6 créneaux (date et heure de début) et une **durée disponible** (par exemple 3 h).
- En tant que membre, je réponds à chaque créneau par **oui**, **peut-être** ou **non**, et je peux changer d'avis.
- En tant qu'organisateur, je vois le tableau des réponses et je **fixe la date**.
- En tant que membre, je vois la liste des soirées à venir et passées de la tablée.

**Cycle de vie d'une soirée**

```
SONDAGE ──(l'organisateur fixe la date)──▶ CONFIRMÉE ──(l'organisateur clôt le vote)──▶ JEUX CHOISIS ──(date passée)──▶ TERMINÉE
   │
   └──(l'organisateur annule)──▶ ANNULÉE
```

**Critères d'acceptation**

- Seul l'organisateur (la personne qui a proposé la soirée) peut fixer la date ou annuler la soirée.
- Une fois la date fixée, les **participants** sont les membres qui ont répondu « oui » à ce créneau. Un membre peut encore se déclarer présent ou absent tant que la soirée n'est pas terminée.
- Le tableau des réponses reste lisible sur mobile, et il ne repose pas uniquement sur la couleur (icône et texte en plus).

### F5. Vote des jeux en temps réel

**Récits**

- En tant que participant, je vois les **jeux compatibles** avec la soirée.
- Je glisse mes jeux préférés dans mon classement et je les réordonne.
- Je vois le **classement global** se mettre à jour en direct quand les autres votent.
- En tant qu'organisateur, je **clos le vote**, ce qui fige le classement.

**Règles de compatibilité**

Un jeu est compatible si :

1. il appartient à un **participant** de la soirée, puisque quelqu'un doit pouvoir l'apporter ;
2. `joueurs min ≤ nombre de participants ≤ joueurs max` ;
3. `durée moyenne ≤ durée disponible`.

**Calcul du classement (méthode de Borda)**

- Chaque participant classe **au plus 5 jeux**. Avec 40 jeux compatibles, tout classer serait pénible.
- Le 1er rapporte 5 points, le 2e 4 points, et ainsi de suite jusqu'au 5e, qui rapporte 1 point.
- Le classement global trie les jeux par total de points. En cas d'égalité, le jeu cité par le plus de participants passe devant ; s'il reste une égalité, on prend l'ordre alphabétique.

**Critères d'acceptation**

- Les autres participants voient une modification de classement en moins d'une seconde, sans recharger la page.
- Si la connexion temps réel tombe, un bandeau « Reconnexion… » s'affiche. Une fois reconnecté, l'état est resynchronisé.
- **Accessibilité** : le glisser-déposer a une alternative au clavier et pour les lecteurs d'écran (boutons « monter » et « descendre », annonce du nouveau rang via une région `aria-live`).
- Le nombre de votants s'affiche (« 4 participants sur 6 ont voté »).

### F6. Parties, scores et statistiques

**Récits**

- En tant que membre, j'enregistre une partie : le jeu, la date, les joueurs (des membres de la tablée), le résultat, et éventuellement la soirée concernée.
- En tant que membre, je consulte l'historique des parties de la tablée.
- En tant que membre, je consulte les statistiques de la tablée.

**Résultat d'une partie**

- **Jeu compétitif** : un ou plusieurs gagnants (les égalités sont possibles), et un score facultatif par joueur.
- **Jeu coopératif** : une victoire ou une défaite collective.

**Statistiques de la V1 (4 au maximum)**

1. **Champion·ne de la tablée** : le plus de victoires, avec le taux de victoire (à partir de 3 parties jouées).
2. **Le jeu fétiche** : le jeu le plus joué.
3. **L'esprit d'équipe** : le taux de victoire de la tablée aux jeux coopératifs.
4. **Le jeu oublié** : le jeu de la ludothèque qui n'a pas été joué depuis le plus longtemps, ou jamais.

**Critères d'acceptation**

- Les statistiques s'affichent en **cartes illustrées**, pas en tableaux de bord ni en graphiques denses.
- Tant qu'il n'y a pas assez de parties, chaque carte affiche un état vide encourageant.

---

## 4. Rôles et permissions

| Action                                                                        | Hôte |          Membre           | Organisateur de la soirée |
| ----------------------------------------------------------------------------- | :--: | :-----------------------: | :-----------------------: |
| Inviter (copier le lien)                                                      |  ✅  |            ✅             |                           |
| Régénérer le lien, renommer la tablée, retirer un membre, supprimer la tablée |  ✅  |                           |                           |
| Proposer une soirée, répondre, voter                                          |  ✅  |            ✅             |                           |
| Fixer la date, annuler, clore le vote                                         |      |                           |            ✅             |
| Enregistrer une partie                                                        |  ✅  |            ✅             |                           |
| Modifier ou supprimer une partie                                              |  ✅  | celui qui l'a enregistrée |                           |

Toutes ces règles sont **vérifiées côté API**. Côté interface, on se contente de masquer les boutons inutiles, ce qui ne protège rien.

---

## 5. Modèle de données (conceptuel)

C'est une première esquisse. Le schéma Prisma définitif sera établi pendant l'étape « Architecture ».

```
Utilisateur ──< Membre >── Tablée
     │                       │
     └──< Jeu                ├──< Soirée ──< Créneau ──< Réponse >── Utilisateur
                             │       │
                             │       └──< Vote (participant, jeu, rang)
                             │
                             └──< Partie ──< Résultat (joueur, gagnant ?, score ?)
                                     │
                                     └── Jeu, Soirée (facultative)
```

| Entité          | Champs principaux                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Utilisateur** | id, e-mail (unique), pseudo, hachage du mot de passe, date de création                                              |
| **Tablée**      | id, nom, emblème, code d'invitation (unique), date de création                                                      |
| **Membre**      | utilisateur, tablée, rôle (`HÔTE` ou `MEMBRE`), date d'arrivée. Unique par couple (utilisateur, tablée)             |
| **Jeu**         | id, propriétaire (utilisateur), nom, joueurs min/max, durée, catégorie, mode                                        |
| **Soirée**      | id, tablée, organisateur, titre, durée disponible, statut, créneau retenu (facultatif)                              |
| **Créneau**     | id, soirée, date et heure de début                                                                                  |
| **Réponse**     | créneau, utilisateur, valeur (`OUI`, `PEUT_ÊTRE`, `NON`). Unique par couple (créneau, utilisateur)                  |
| **Vote**        | soirée, utilisateur, jeu, rang (de 1 à 5). Unique par (soirée, utilisateur, rang) et par (soirée, utilisateur, jeu) |
| **Partie**      | id, tablée, jeu, soirée (facultative), date, auteur, victoire collective (pour le mode coop)                        |
| **Résultat**    | partie, joueur, gagnant (booléen), score (facultatif)                                                               |

Points d'attention à trancher pendant l'architecture :

- Que devient une partie quand son jeu est supprimé par son propriétaire ? Piste : on conserve le **nom du jeu** dans la partie (dénormalisation), ou on archive le jeu au lieu de le supprimer.
- Les participants d'une soirée sont **calculés** à partir des réponses au créneau retenu. On ne les stocke pas en double.

---

## 6. Exigences non fonctionnelles

### 6.1 Accessibilité

- Objectif **WCAG 2.2 niveau AA**.
- Tout est utilisable au clavier, avec un focus toujours visible.
- Contrastes vérifiés sur la palette chaleureuse, où les tons crème et terracotta sont un risque.
- `prefers-reduced-motion` est respecté, et les formulaires ont de vrais `label` et des erreurs reliées aux champs.

### 6.2 Responsive et performance

- Conception **mobile d'abord** : la plupart des réponses aux sondages se feront sur téléphone, depuis un lien partagé.
- Les pages sont chargées à la demande (_lazy loading_ des routes).
- Objectif Lighthouse : au moins 90 en performance et en accessibilité, sur mobile.

### 6.3 Sécurité

- Mots de passe hachés avec **argon2**.
- JWT stocké dans un cookie `httpOnly`, `Secure`, avec un attribut `SameSite` adapté. Il n'est jamais accessible au JavaScript.
- Validation de toutes les entrées côté API (DTO et `ValidationPipe`).
- Limitation du nombre de tentatives sur la connexion et l'inscription.
- Chaque requête vérifie que l'utilisateur est bien membre de la tablée visée.
- **Limite assumée de la V1** : il n'y a pas d'envoi d'e-mails, donc pas de mot de passe oublié. Cette limite sera documentée dans le README.

### 6.4 Qualité

- TypeScript en mode `strict` sur le front comme sur l'API.
- **CI GitHub Actions** : lint, vérification des types, tests unitaires (front et API) et tests end-to-end Playwright sur les parcours clés (inscription, rejoindre une tablée, sondage, vote).
- Un README structuré et un journal des décisions dans `docs/decisions.md`.

---

## 7. Contraintes techniques

| Brique          | Choix                                                                                       | Statut    |
| --------------- | ------------------------------------------------------------------------------------------- | --------- |
| Front           | Angular (composants autonomes, signals, formulaires réactifs typés, glisser-déposer du CDK) | décidé    |
| API             | NestJS (REST, passerelle WebSocket)                                                         | décidé    |
| Base de données | PostgreSQL (Neon) + Prisma                                                                  | décidé    |
| Dépôt           | Monorepo `lauradimitroff/tablee`, avec workspaces npm (`apps/web`, `apps/api`)              | décidé    |
| Hébergement     | Front sur Vercel, API sur Render ou Railway                                                 | à affiner |

### ⚠️ Point d'architecture identifié dès maintenant

Le front (`tablee-jeux.vercel.app`) et l'API (`*.onrender.com`) seront sur **deux sites différents**. Or les navigateurs bloquent de plus en plus les cookies envoyés d'un site à un autre (Safari en tête). Un cookie de session posé par l'API risque donc de ne jamais être renvoyé.

Deux pistes, à étudier à l'étape « Architecture » :

1. un **proxy** côté Vercel (_rewrites_ `/api/*` vers l'API), pour que le navigateur ne voie qu'un seul site ;
2. une adaptation spécifique au **WebSocket**, que les _rewrites_ de Vercel ne transmettent pas. Par exemple, un jeton court récupéré en REST et envoyé à l'ouverture de la connexion.

À noter aussi : l'offre gratuite de Render met l'API en veille, et le premier appel peut alors prendre environ 50 secondes. Ça influence le choix de l'hébergeur.

---

## 8. Direction artistique (intentions)

C'est la direction **« Ludothèque chaleureuse »**. La planche complète (palette, typographies, composants) sera faite à l'étape 0.

- **Ambiance** : une table en bois un soir d'hiver, des boîtes de jeu empilées, des fiches de score griffonnées.
- **Couleurs** : papier crème en fond, bois et kraft, accents terracotta et vert sapin. Prévoir aussi un thème sombre.
- **Typographies** : des titres en serif doux, un texte courant en sans-serif très lisible.
- **Détails** : des cartes façon fiche cartonnée, des micro-animations sobres (un dé qui roule pendant le chargement, par exemple), désactivées si `prefers-reduced-motion` est actif.
- **À éviter** : tout ce qui rappelle Atollo (dashboard), Métamorphoses (3D végétale) et Pocki (palette à préciser).

---

## 9. Découpage du projet

| Étape | Contenu                                                              |
| ----- | -------------------------------------------------------------------- |
| **0** | Cahier des charges (ce document), direction artistique, architecture |
| **1** | Mise en place : monorepo, CI, base de données Neon, Prisma           |
| **2** | Authentification : côté API, puis côté Angular                       |
| **3** | Tablées et invitations                                               |
| **4** | Ludothèque                                                           |
| **5** | Soirées et sondage de dates                                          |
| **6** | Vote des jeux en temps réel                                          |
| **7** | Parties, scores et statistiques                                      |
| **8** | Finitions : accessibilité, tests end-to-end, déploiement, README     |

Chaque étape sera découpée en petites sous-étapes (1a, 1b…). Après chacune : vérification dans le navigateur, validation, puis commit.

---

## 10. Points validés le 20/11/2026

Les propositions ci-dessous, marquées plus haut, sont acceptées telles quelles.

1. L'hôte ne peut pas quitter sa tablée, mais peut la supprimer (F2).
2. La liste des catégories de jeux (F3).
3. Seuls les jeux des participants sont proposés au vote (F5).
4. Le classement est limité à 5 jeux par participant (F5).
5. Les 4 statistiques retenues (F6).
6. Les couleurs et typos de Pocki, pour s'en démarquer (§ 8).
