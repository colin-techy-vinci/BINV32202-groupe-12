- Une candidature retirée peut être recréée pour la même offre.

- Seul le statut `IN_PROGRESS` peut être retiré.

- La liste est filtrée par défaut sur l'année académique courante, conformément à
  EF-72; une évolution vers un filtre explicite pourra être ajoutée séparément.

- Le périmètre couvre backend et interface frontend complète.

fichiers crée : 

useApplication.ts -> pour le contexte de l'app dans le frontend

application.service.ts -> faire les fetch du back dans le front

applicationPage.tsx -> création de la page en front pour visualiser ses candidatures

ApplicationTable.tsx -> creation d'un item qui permet d'afficher la liste des offres

ApplicationForm.tsx ->  creation d'un item form pour le frontend



---     BACKEND     ---

application.ts -> ajout d'interface dans le back pour les models

applications.controller.ts -> création du endpoint pour qu'un étudiant candidate 

application.service.ts -> creation du service de gestion de candidatures

application.repository.ts -> repository qui crée les differents schéma de la DB.

application.mapper.ts -> transformation en differents models grâce au mapper


fichiers modifiés :

guards.ts -> rajouté une validation pour verifier que le model correspond bien au model attendu

OffersPage.tsx -> Ajoute les differents items créent précédement + ajout d'html 

NavBar.tsx -> ajout dans la navbar des candidatures

labels.ts -> ajout des differents status pour une candidatures


---     BACKEND     ---


app.ts -> crée la route dans le backend

permission.ts -> rajoute un check de permission sur le user



Résultat : Tout fonctionne pas de problème, fluide,...

Validation fonctionnelle : Visualisation candidatures OK, retrait candidature OK, Postuler cnadidature OK, Changement d'état candidature OK

Qualité : La qualité générale est correct mais il faut modifier le frontend pour le processus à candidaté à une offre car peu visilbe, peu attractif et peu intuitif.

Tests et commandes : Test ajouté (application.test.ts, ApplicationPage.test.tsx) et modifié (OffersPage.test.tsx) et voici le resultat que l'ia à fourni avec ses checks 
lint : réussi ;
typecheck : réussi ;
backend : 113 tests réussis ;
frontend : 47 tests réussis ;
build : réussi.


Nombre de crédits utilisé : 8 credits / 4 %

IA utilisé : GPT-5.6 Luna