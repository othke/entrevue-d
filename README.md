# Questions
*Concevez une classe Collection qui encapsule la bibliothèque lodash.*


Le code se trouve dans le fichier `collection.ts`. Des test unitaires sont présents dans le fichier `collection.test.ts`.
On peut jouer avec la Collection en lançant la commande `npm install` et `npm run dev`.


Le choix a été fait d'utiliser un Proxy pour intégrer les fonctionnalités de `lodash` a la collection.




## Question
*Dans le contexte des bases de données NoSQL orientées document, quelle difficulté avez-vous rencontrée lors de la gestion de documents à plusieurs niveaux? Décrivez par quels moyens vous y avez pallié ou l’avez surmonté.*


## Réponse
Dans le cadre de l'utilisation de base de données NoSQL, la principale difficulté est **la structuration du modèle de données**. On a tendance à limiter les relations entre les différentes tables/collections de documents afin d'améliorer les performances des requêtes. Pour se faire on va dupliquer certaintes informations, plus particulièrement celles qu'on veut utiliser massivement pour dans nos requêtes.


Ces informations seront regroupées et indexées dans un même document. En **dénormalisation** la base de données, on va pouvoir gagner en performance, par contre, il faut mettre en place une stratégie de **mise à jour des données** pour éviter les incohérences.


En dénormalisant sa base de donner on peut aussi simplifier l'aspect transactionnel des opérations sur la base. Si un document contient son information propre et certaines relations, on limite la complexité des opérations de mise à jour.




## Question
*Dans l'environnement des bases de données NoSQL orientées document, que quelle manière avez-vous utilisé la dénormalisation? Quels en ont été les inconvénients et comment y avez-vous pallié?*


## Réponse
Pour compléter la réponse à la première question, le principale inconvénient de la dénormalisation est **La duplication de données** et ses conséquences: augmentation de la taille du stockage mais surtout la gestion de la cohérence des données.


Pour traiter le problème de la gestion de la cohérence des données, il faut avant tout éviter une dénormalisation qui ait pour conséquence de lancer une tâche de réconciliation trop fréquente et trop lourde. Par exemple, à chaque fois que l'on modifie une donnée dupliquée dans plusieurs documents. Il faut donc éviter de dénormaliser des données qui sont susceptibles d'être modifiées fréquemment.


Par exemple:
Pour une application une collection/table de documents utilisateurs peut contenir une liste d'achats associés à chaque document. Cette conception a un intérêt pour améliorer les recherches par produits sur la liste des utilisateurs. En principe, un produit ayant été acheté, la description de son achat ne devrait pas être modifiée. On peut donc dénormaliser cette information sans risque de cohérence des données. A tout moins les opérations de mise à jour pourront se faire de façon planifiées par des scripts.


Par contre, si on souhaite dénormaliser la liste des catégories préférées d'un utilisateur, ou toutes autres informations dont les intitulés sont susceptibles de changer assez fréquemment et donc de déclencher une procédure de mise à jour rapide, on risque de dégrader les performances de la base de données.




## Question
*Quels mécanismes peuvent être mis en place pour actualiser le front-end lorsqu'une modification des données est effectuée par d'autres utilisateurs? Veuillez décrire une approche que vous avez utilisée pour ce type de rafraichissement automatique, en soulignant ses avantages et ses limites.*


## Réponse
L'utilisation de **WebSockets** permet de mettre en place un système de notification entre le serveur et le client. Le serveur peut envoyer des messages au client pour l'informer d'une modification des données. Le client peut alors mettre à jour son interface utilisateur.
Le principale inconvénient de ce système est la gestion des déconnexions et des pertes de messages.


Dans le cadre du développement d'un canal de notification, on a développé une librairie qui gère les aspects de connexion/reconnexion/déconnexion et la gestion et la gestion des messages.


Les contraintes de connexion:
- Coupure de connexion internet. La libraire est responsable de détecter les informations du navigateur
- Déconnexion par le serveur. Mise en place d'un mécanisme de reconnexion avec gestion des intervalles.
- Gestion des codes d'erreur d'une WebSocket


Gestion des messages:
- La librairie récupère l'état actuel via une requête HTTP puis établit la connexion par WebSocket pour les informations en temps réel.
- A chaque reconnexion, la librairie récupère l'état actuel via une requête HTTP puis établit la connexion par WebSocket pour les informations en temps réel.




## Question
*Lors de l'exécution d'une API hébergée sur AWS Lambda (ou Azure Functions) en NodeJS, vous observez que le temps d'exécution dépasse souvent la limite fixée à 2 minutes. Cette API charge et analyse plusieurs documents (factures mensuelles) depuis une base de données. À l'issue de cette analyse, l'API retourne un résumé des anomalies relevées dans les factures, telles que des montants excessifs, des codes produits invalides ou des quantités dépassant les quotas. Quelle(s) stratégie(s) recommanderiez-vous pour résoudre ce problème, afin que l'utilisateur de l'API puisse obtenir le rapport d'anomalies sans dépasser le délai de deux minutes?*




## Réponse
Compte tenu de la question, on peut supposer que le traitement des documents est trop long car la récupération des documents depuis la base de données est trop longue ou que le traitement effectué sur AWS Lambda est trop long.


- Cas d'un transfert trop long
Si on ne peut pas améliorer la performance de la récupération des documents depuis la base de données, on peut envisager d'informer l'utilisateur via une communication temps réel (ou un email) que le traitement est en cours et qu'il sera informé dès que le traitement sera terminé. Si on tient à conserver le traitement sur une AWS Lambda, il faudra alors augmenter la limite de temps d'exécution de la fonction.


- Cas d'un traitement trop long
Dans le cas d'une mauvaise optimisation de l'algo, on peut voir comment utiliser du cache pour accélérer la récupération des données avec cloudfront si c'est applicable. On pourra aussi veiller à ce que la fonction parallélise au maximum le chargement et les traitements des informations avec un bon usage des fonctions asynchrones.


- Cas d'un traitement trop long parce que complexe à traiter
Pour résoudre ce problème, on peut envisager de découper le traitement en plusieurs étapes pour augmenter la disponibilité de ressources de traitement. On peut utiliser une file d'attente pour stocker les documents à traiter. Avec un service comme SQS on peut distribuer le traitement à plusieurs fonctions. Cette option peut ajouter une certaine complexité et nécessite une base de données pour synchroniser l'état des sous traitements.


## Question
*Comment l'architecture orientée événement contribue-t-elle à promouvoir un faible couplage entre les composants du backend ? Veuillez donner des exemples spécifiques, idéalement tirés de votre expérience, et expliquer comment cette approche peut améliorer la scalabilité et la maintenabilité de l'application.*


## Réponse
L'architecture orientée évènement permet de découpler les composants du backend en silo. Chaque composant peut être développé et déployé indépendamment. Les composants communiquent entre eux via des messages. Les messages peuvent être stockés dans une file d'attente. Les composants peuvent donc être développés, testés et déployés indépendamment.


Exemple: Dans le cadre d'un système de gestion d'annonces pour un site de vente, différentes équipes sont amenées à consulter l'état et les statistiques des annonces. De plus, certaines données spécifiques où issues de calculs (agrégations, statistiques) ne sont utiles que pour certaines équipes. Pour garantir l'intégrité des données exposées aux utilisateurs, le système est découpé de sorte que les modifications des données de références déclenchent des événements (streams) qui seront consommés par les fonctions des autres équipes qui mettront à jour leurs tables de travail afin de ne jamais altérer les données principales.
Ce système permet notamment de ne pas avoir à connaître/comprendre l'architecture des autres équipes et de se focaliser sur son propre système. On considère les interactions avec les autres systèmes par le biais des évènements et les APIs publiques.




## Question
*Dans le cadre d'une revue de code pour une application Node.js destinée à être déployée sur AWS Lambda, cette application interagit avec une base de données multi-tenante. Quels seraient vos principaux points de vigilance concernant la sécurité ? Pourriez-vous citer et expliquer les éléments spécifiques que vous chercheriez dans le code pour garantir une exploitation sécurisée et une bonne isolation des données entre les locataires ?


## Réponse
En préalable, je demanderais de préciser le point suivant:
- Comment la séparation des tenants est-elle gérée? Est-ce que chaque tenant a sa propre base de données ou est-ce que les tenants sont gérés dans une même base de données?
Je comprends que chaque organisation se connecte via la même application et que le backend se charge d'authentifier, autoriser et de router les requêtes vers la bonne base de données/schéma ou d'appliquer les filtres utilisateurs à chaque requête.


Le choix d'une stratégie de multi tenant (silo, pool) aura des incidences sur la stratégie d'accès aux données. Par exemple, en silo, on va devoir mettre en place un composant qui appliquera les requêtes sur des tables spécifiques à chaque tenant. En pool, on va devoir appliquer des filtres sur les requêtes pour limiter les données accessibles à chaque tenant.


Mais au préalable, on doit regarder dans le code que la récupération et la validation d'un token d'identification est bien implémentée. Ce token permettra ensuite d'autoriser le tenant et en fonction de la stratégie retenue pour la base de données, d'appliquer la logique de routage ou de filtrage des données.
## Question
Expliquez sommairement oAuth, JWT et la signature de tokens et expliquer comment vous avez utilisé ces concepts dans un projet.


## Réponse
OAuth est un protocole d'autorisation permettant à une application (client) d'accéder à des données d'un utilisateur (resource owner) sur un serveur (resource server) sans avoir accès aux informations de connexion du client. Cela permet également au resource owner de révoquer l'autorisation à n'importe quel moment. L'application reçoit un token d'accès qui lui permet d'accéder aux ressources de l'utilisateur.


En tant que développeur, j'ai pu utiliser ce protocole le plus souvent pour obtenir les ressources d'identification d'un utilisateur afin de s'authentifier sur une application.


JWT est un format de token en JSON qui contient un payload souvent sur les données d'un utilisateur (nom, email, permissions, etc.). Une entête contient les informations sur la signature du token. Une signature contenu dans le token permet de vérifier l'intégrité du token. Pour se faire, cette signature utilise un secret. Un service qui veut valider un token doit avoir accès à ce secret.
Cette validation permet de s'assurer que le token n'a pas été compromis.


En tant que développeur, j'ai pu utiliser un jwt côté client pour le transmettre en entête HTTP afin d'authentifier des requêtes. Côté serveur, j'ai pu utiliser ce token pour valider l'identité d'un utilisateur et lui donner accès à certaines ressources.
Nous utilisons également un refresh token afin de limiter la durée de validité d'un token et ainsi limiter les risques de compromission du token dans le temps. En revanche l'utilisation d'un refresh token nécessite de stocker ce dernier de façon sécurisée.

