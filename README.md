# Poulp'App

La **Poulp'App** est une application mobile destinée aux étudiants de l'**ENSC** (École Nationale Supérieure de Cognitique). Elle centralise sur une seule plateforme l'ensemble des informations liées **à la vie associative de l'école**.

**Login flow**
</br>
<img src="assets/docs/login.jpg" height="400" alt="login_screen">
<img src="assets/docs/signup.jpg" height="400" alt="login_screen">
</br>

**Main screens**
</br>
<img src="assets/docs/feed.jpg" height="400" alt="login_screen">
<img src="assets/docs/bde.jpg" height="400" alt="login_screen">
<img src="assets/docs/score.jpg" height="400" alt="login_screen">
<img src="assets/docs/menu.jpg" height="400" alt="login_screen">

## Table of Contents

- [Poulp'App](#poulpapp)
  - [Table of Contents](#table-of-contents)
  - [1. Fonctionnalités](#1-fonctionnalités)
    - [1.1 Les posts](#11-les-posts)
      - [A. Le fil d'actualité](#a-le-fil-dactualité)
      - [B. Calendrier](#b-calendrier)
    - [1.2 Les associations](#12-les-associations)
    - [1.3 La Coupe des Familles](#13-la-coupe-des-familles)
      - [A. Graphique](#a-graphique)
      - [B. Points](#b-points)
  - [2. Technologies](#2-technologies)
    - [Packages principaux](#packages-principaux)
  - [3. Architecture](#3-architecture)
    - [3.1 Firebase](#31-firebase)
      - [A. Authentication](#a-authentication)
      - [B. Firestore](#b-firestore)
    - [3.2 Navigation](#32-navigation)
  - [Futur](#futur)

## 1. Fonctionnalités

L'application permet aux étudiants de consulter des **posts** annonçant divers événements. Elle regroupe également toutes les informations concernant les **associations**, les **clubs** et les **partenariats**. Un graphique intégré permet de suivre l'évolution de la **Coupe des Familles**.

### 1.1 Les posts

La fonctionnalité principale est la publication de posts par les associations majeures de l'école (BDE, BDS, BDA et JE).

Un post est composé de :

- un titre
- une description
- une image
- une date
- des tags

#### A. Le fil d'actualité

#### B. Calendrier

### 1.2 Les associations

### 1.3 La Coupe des Familles

#### A. Graphique

#### B. Points

## 2. Technologies

Outils principaux :

- React Native
- Firebase (Auth, Firestore, Storage)
- Expo - EAS
- Typescript

### Packages principaux

- @backpackapp-io/react-native-toast : ^0.11.0
- @react-native-async-storage/async-storage : 1.23.1
- @react-native-community/datetimepicker : 8.0.1
- @react-navigation/native : ^6.1.15
- @react-navigation/native-stack : ^6.9.24
- dotenv : ^16.4.7
- effector : ^23.2.0
- effector-react : ^23.2.0
- expo-image-picker: ~15.0.7
- react-hook-form : ^7.51.1
- react-native-calendars : ^1.1307.0
- react-native-paper : ^5.12.3
- styled-components : ^6.1.8
- victory-native : ^41.12.0

## 3. Architecture

### 3.1 Firebase

#### A. Authentication

#### B. Firestore

### 3.2 Navigation

## Futur

Voici les fonctionnalités et améliorations graphiques prévues :

- Un éditeur de texte (hyperlien, gras, italique, souligné, taille de police, couleur)
- Modifier son profil (étudiants et associations)
- Ajouter et supprimer des étudiants (administrateur)
- Gestion de ses propres posts (associations)
- Importer des vidéos sur les posts
- Galerie intégrée avec les images chargées sur l'application
- Filtre du fil d'actualité (par association, par date, etc.)
- Possibilité d'ajouter un sondage dans le post
- Réactions et commentaires à un post
- Importer un tableur pour sélectionner automatiquement les étudiants qui ont adhéré à une association
- ...
