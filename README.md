# Botmind Twitter Nx

Ce projet est construit avec le système de [monorepo Nx](https://nx.dev/guides/why-monorepos), il permet notamment de :
 - Mutualiser les dépendances et la configuration.
 - Utiliser les libraries créées en commun.
 - Réduire les temps de build par un système de cache.

Le projet est découpé en 3 parties / applications :

- Le frontend construit avec Angular.
- Le backend construit avec NestJS et Express.
- La base de donnée PostGreSQL.

L'application consiste en un mini clone de Tweeter, voici les fonctionnalités principales :

- Création decompte
- Connexion à l'application avec le compte créé
- Créer des tweets, les modifier et les supprimer.
- Pouvoir répondre à des tweets et créer un fil de discussion. Ces réponses peuvent être modifiés et supprimés par leur propriétaire respectif.
- Aimer les tweets des autres utilisateurs.

## Démarrer

Dépendances :

- node v16 LTS
- docker v20.10.11 minimum
- docker-compose v1.29.2 minimum

```bash
# Cloner ce dépôt
git clone https://github.com/alexandre-dos-reis/botmind-twitter-nx.git

# Installer les dépendances
npm i

# Démarrer docker puis lancer le bdd PostGreSQL et Adminer avec
docker-compose up -d

# Démarrer toutes les services 
# (Supprimez "npx", si vous installez la commande "nx" globalement)
npx nx run-many --target=serve --all

# Démarrer un service particulier
npx nx serve < backend | frontend >
```