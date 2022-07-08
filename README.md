# Botmind Twitter Nx

Ce projet est construit avec le système de [monorepo Nx](https://nx.dev/guides/why-monorepos), il permet notamment de :
 - Mutualiser les dépendances et la configuration.
 - Utiliser les libraries créées en commun.
 - Réduire les temps de build par un système de cache.

Le projet est découpé en 3 parties / applications :

- Le frontend construit avec Angular.
- Le backend construit avec NestJS qui lui même utilise Express.
- La base de donnée PostGreSQL.

L'application consiste en un mini clone de Tweeter, voici les fonctionnalités principales :

- Création d'un compte
- Se conncter à l'application avec le compte créé
- Créer des tweets, les modifier et les supprimer.
- Pouvoir répondre à des tweets et créer un fil de discussion. Ces réponses peuvent être modifiés et supprimés par le propriétaire respectif.
- Aimer les tweets des autres utilisateurs.