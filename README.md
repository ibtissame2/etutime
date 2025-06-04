# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.
1. Objectif du projet
Ce projet vise à développer une application web dédiée aux étudiants pour leur permettre d'organiser efficacement leurs études, suivre leur progression, gérer leurs modules et documents, et adapter leur emploi du temps en fonction de leur niveau de concentration.
2. Cibles utilisateurs
Étudiants de tous niveaux ayant besoin d’un outil de planification, de suivi du temps, et de gestion de documents pédagogiques.
3. Fonctionnalités principales
3.1 Accès & Profil
•	Inscription avec formulaire de 14 questions pour déterminer le niveau de concentration (élevé, moyen, faible).
o	4 questions sur l’organisation
o	4 questions sur la concentration
o	4 questions sur la motivation
o	2 questions sur la personnalisation
•	Page Profil avec informations personnelles : email, localisation, téléphone, date d’inscription.
•	Possibilité de modifier les informations à tout moment.
3.2 Page d’accueil
•	Menu principal : Accueil, Environnement, Temps, Rapport, Emploi du temps, Documents, Programme, Chrono actuel, Profil.
•	Zone de saisie du chapitre à étudier, avec précision du module et de la tâche associés.
•	Démarrage d’un minuteur pour suivre l’étude.
•	Affichage des minuteurs récents avec nom du chapitre, module et bouton pour relancer le chronomètre.
•	Graphique d’activité (30 jours) : 30 cases représentant les 30 derniers jours, colorées si un minuteur a été utilisé.
•	Classement (Team Activité) : classement des étudiants ayant étudié le plus durant la semaine.
•	Graphique hebdomadaire : temps total par jour (graphe linéaire).
•	Graphe circulaire : temps d’étude réparti par module sur la semaine.
3.3 Gestion du temps
•	Page « Temps » : historique complet du temps d’étude pour chaque jour, avec chapitre, module, tâche.
•	Possibilité de saisir manuellement du temps non enregistré.
•	Synchronisation avec les minuteurs de la page d’accueil.
3.4 Environnement de travail
•	Affichage des chronos de tous les étudiants ayant le même niveau de concentration (visible via résultats des 14 questions).
•	Visualisation des cours/fichiers importés depuis la page « Importer ».
•	Interaction sociale ou collaborative possible.
3.5 Emploi du temps
•	Si concentration élevée : possibilité de créer soi-même l’emploi du temps.
•	Si concentration moyenne/faible : génération automatique d’un emploi du temps adapté.
o	Minimum requis : 4 modules
o	Remplissage obligatoire du temps
•	Interface de modification de l’emploi du temps.
•	Emploi du temps structuré sous forme de blocs (comme l’accueil).
3.6 Programme d’étude
•	Modules :
o	Créer, afficher, supprimer ou archiver
o	Statut : actif ou archivé
o	Affichage : durée totale, progression (début, en cours, terminé)
•	Chapitres :
o	Ajouter, modifier, supprimer
•	Tâches :
o	Créer, afficher, supprimer
3.7 Gestion des documents
•	Page Notes :
o	Ajouter des notes avec un titre
o	Formats : liste simple, liste à cocher, tableau
o	Dates de création et de modification
o	Modifier ou supprimer les notes
•	Page Importer :
o	Importation de fichiers PDF
o	Affichage des documents
o	Suppression possible
3.8 Rapports
•	Graphiques linéaires : temps par jour
•	Graphe circulaire : répartition du temps par module
•	Tableaux récapitulatifs
•	Filtres :
o	Par module
o	Par durée : aujourd’hui, cette semaine, cette année
•	Données associées aux minuteurs
________________________________________
4. Pages supprimées ou remplacées
•	Suppression de la page Navigation
•	Nouvelles pages créées :
o	Environnement
o	Temps
o	Importer
o	Notes
o	Modules
o	Chapitres
o	Tâches
o	Rapport


Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
![Image](https://github.com/user-attachments/assets/4cb5ca94-d1ac-46be-ab86-719a328ccd71)
![Image](https://github.com/user-attachments/assets/14be9e45-fc5f-4e83-b8c6-4bfdcb54ce76)
![Image](https://github.com/user-attachments/assets/c7d69690-cd65-400d-93ee-4a436fe3a785)
![Image](https://github.com/user-attachments/assets/8047cdff-b20e-466a-89b9-2f190aff9417)
![Image](https://github.com/user-attachments/assets/1978bfe6-7d80-446f-a65a-952f12bd602a) 

