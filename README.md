# Tablée

Soirées jeux.

Tablée aide un groupe d'amis à trouver une date, voir qui vient, choisir les jeux et garder l'historique des parties.

> Projet en cours de développement : section « Lab » du portfolio de Laura Dimitroff.

## Stack

- **Front** : Angular 22 (`apps/web`)
- **API** : NestJS + Prisma (`apps/api`), à venir
- **Base** : PostgreSQL (Neon)
- **Partagé** : `packages/shared`, types et constantes communs

## Prérequis

- Node 24 (`nvm use`)

## Commandes

```bash
npm install            # installe tout le monorepo
npm run build:shared   # compile packages/shared
npm run typecheck      # vérifie les types de tous les paquets
npm run format:check   # vérifie le formatage (Prettier)
npm start -w @tablee/web # lance le front sur http://localhost:4200
npm test -w @tablee/web  # tests unitaires du front (Vitest)
```

## Documentation

- [Cahier des charges](docs/cahier-des-charges.md)
- [Architecture](docs/architecture.md)
- [Journal des décisions](docs/decisions.md)
- [Direction artistique](docs/direction-artistique.html)
