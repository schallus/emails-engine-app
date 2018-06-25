# Wide -Emails engine

## Installation

- Dépendance: Node.js 0.12

Télécharger le projet avec Git (change username):

```bash
git clone http://username@git.cross-systems.ch/wide/emails-engine.git
```

Ensuite, ouvrir le dossier et installer les dépendances:

```bash
cd emails-engine
npm install
```


## Structure

La structure doit être respecté afin d'assurer le bon fonctionnement du moteur.
Chaque projet doit avoir un layout, une page et une feuille de style (nommée app_client_projet.scss)

- dist
  + client_name
    * **NEW images/**
    * project_name
- etc
- node_modules
- src
  - clients
    * client_name
      - project_name
        + data: contenus textuels (lang)
          * **NEW data-lang.json**
        + images: images du projet
          * **NEW uploads/**
        + layouts: enveloppe du projet (html - head, body)
        + pages: différents templates emails
          * **NEW structure.json**
        + scss
      - project_name
      - ...
      - partials: composant HTML communs au client(preheader, footer, etc...)
      - scss: styles communs au client
      - **NEW campaigns.json**
      - **NEW blocks.json**
    * client_name
    * ...
    * **NEW brands.json**
  - helpers: functions js pour Handlebars


## Création d'un nouveau client/projet

Chaque client a un dossier portant son nom dans src/clients/nom_client <br>
Les projets sont séparés par sous-dossier dans src/clients/nom_client/nom_projet

Lors de la création d'un nouveau projet, il est impératif de suivre cette structure:<br>
- layouts: fichier HTML avec la structure head, body + appel de la CSS.
- pages: fichier(s) HTML avec une référence au layout utilisé et le contenu de la newsletter.
- scss: CSS principale nommée app_client_projet avec les différentes inclusions.
- images: images de la newsletter
- data: contenu textuel de la newsletter (utile si plusieurs langues)

Certains éléments peuvents être communs à plusieurs projets, ils sont à placer dans le dossier client:
- partials: pour les blocs communs (header, footer, galerie, etc...)
- scss: styles communs (couleurs, style d'un partial, etc...)


## Build Commands

Run `npm start client/projet` pour lancer le serveur, un nouvel onglet pointant sur le projetva s'ouvrir.

Run `npm run build client/projet` pour lancer le build process, HTML minifié et CSS inline.

Run `npm run cdn client/projet` pour lancer le build, uploader les images sur le ftp (cloud cross) et remplacer les liens. 

Run `npm run zip client/projet` pour créer un zip de l'archive dans le dossier dist.

## MDB Pro

Access Token: kEQ4iX34kDwMpNhcfEzV

### Procédure d'installation

npm install git+https://oauth2:kEQ4iX34kDwMpNhcfEzV@git.mdbootstrap.com/mdb/angular/ng-uikit-pro-standard.git