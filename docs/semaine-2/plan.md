# Plan EF-32 / EF-33 — candidatures étudiantes

## Problème et approche

Le schéma SQLite possède déjà `applications` et les quatre codes de statut requis,
mais aucune route, couche métier ou interface ne permet encore à un étudiant de
postuler, de consulter ses candidatures ou d'en retirer une. Le plan consiste à
compléter le flux de bout en bout en réutilisant l'architecture offres existante :
repository → mapper/modèles → service métier → contrôleur protégé → service/hook/page
frontend.

## Trois étapes proposées

1. **Candidater à une offre publiée**
   - Ajouter une route étudiante de création, avec message facultatif.
   - Vérifier côté contrôleur le corps JSON et côté service l'identité étudiante,
     l'existence de l'offre, son statut `PUBLISHED` et les doublons actifs.
   - Autoriser une nouvelle candidature après une candidature `WITHDRAWN`, selon la
     décision retenue.
   - Ajouter dans l'interface de détail/liste des offres un formulaire de message
     facultatif et les états de succès/erreur.

2. **Consulter ses candidatures**
   - Ajouter une lecture filtrée par l'étudiant authentifié, par défaut sur l'année
     académique courante conformément à EF-72, triée de façon stable.
   - Exposer les informations nécessaires (offre, entreprise, année, période, date,
     message éventuellement utile, statut code) et traduire les statuts en
     « En cours », « Retenue », « Non retenue », « Retirée » dans le frontend.
   - Ajouter une page/navigation dédiée, avec états chargement, erreur et liste vide.

3. **Retirer une candidature**
   - Ajouter une route de retrait ciblée par identifiant de candidature.
   - Vérifier que la candidature appartient à l'étudiant courant et que son statut
     est encore `IN_PROGRESS`; les statuts traités ne sont pas retirables.
   - Passer le statut à `WITHDRAWN` sans suppression physique, puis rafraîchir la
     liste côté frontend.

## Fichiers et composants concernés

### Backend

- `backend/src/app.ts` : assembler le repository/service/router des candidatures.
- `backend/src/controllers/applications.controller.ts` : routes POST/GET/PATCH ou
  DELETE, validation des paramètres et réponses HTTP.
- `backend/src/services/applications.service.ts` : règles EF-32/EF-33, contrôle
  étudiant et transitions.
- `backend/src/repositories/applications.repository.ts` : requêtes d'insertion,
  lecture jointe offre/entreprise/année/période, recherche par id et mise à jour.
- `backend/src/models/application.ts` et `backend/src/mappers/application.mapper.ts` :
  DBO, domaine, DTO et conversion des codes de statut.
- `backend/src/services/permissions.ts` : permission nommée pour les étudiants si
  le pattern `authorize` le justifie.
- `backend/API.md` : contrat des routes, corps, statuts et erreurs.
- `backend/src/db/migrations/002_*.sql` : uniquement si une contrainte manquante
  doit être ajoutée; ne pas modifier `001_initial.sql`.
- `backend/src/db/seed/seedIds.ts`, `backend/src/db/seed/offersData.ts` :
  compléter les fixtures seulement si nécessaire aux scénarios.
- `backend/tests/applications.test.ts` : tests API d'accès, création, lecture et retrait.
- `backend/tests/db/constraints.test.ts` / `backend/tests/db/migrations.test.ts` :
  vérifications structurelles si le schéma évolue.

### Frontend

- `frontend/src/models/application.ts` et `frontend/src/utils/guards.ts` :
  modèle, statuts et garde de réponse.
- `frontend/src/services/applications.service.ts` : appels API et validation JSON.
- `frontend/src/hooks/useApplications.ts` : chargement, soumission, retrait et
  gestion du 401.
- `frontend/src/pages/ApplicationsPage.tsx` et composants associés :
  liste, libellés, bouton de retrait et état vide.
- `frontend/src/pages/OffersPage.tsx` et/ou composant d'offre :
  formulaire de candidature depuis une offre publiée.
- `frontend/src/App.tsx`, `frontend/src/components/NavBar.tsx` et
  `frontend/src/utils/permissions.ts` : route et navigation étudiant.
- `frontend/tests/ApplicationsPage.test.tsx`, `frontend/tests/OffersPage.test.tsx`
  et tests ciblés de guards/services si nécessaire.

## Vérifications et tests envisagés

- Backend : étudiant autorisé; administrateur/contact refusés si la route est
  étudiante; offre non publiée/inexistante refusée; message absent ou valide
  accepté; message invalide refusé; doublon `IN_PROGRESS` refusé; nouvelle
  candidature après `WITHDRAWN` acceptée; lecture isolée par étudiant et année;
  retrait autorisé uniquement en `IN_PROGRESS`; retrait d'une candidature d'autrui
  ou traitée refusé; statut persisté à `WITHDRAWN`.
- Frontend : formulaire visible pour une offre publiée, message facultatif,
  succès et erreur; candidatures rendues avec les quatre libellés; bouton de
  retrait seulement pour « En cours »; rafraîchissement après retrait; chargement,
  liste vide et 401.
- Validation finale : tests backend/frontend ciblés, puis `npm run lint`,
  `npm run typecheck`, `npm test` et `npm run build` si les tests ciblés passent.

## Décisions métier retenues

- Une candidature retirée peut être recréée pour la même offre.
- Seul le statut `IN_PROGRESS` peut être retiré.
- La liste est filtrée par défaut sur l'année académique courante, conformément à
  EF-72; une évolution vers un filtre explicite pourra être ajoutée séparément.
- Le périmètre couvre backend et interface frontend complète.

## Points restant à surveiller pendant l’implémentation

- Choisir le verbe HTTP exact pour le retrait et le statut de réponse en cohérence
  avec les conventions du dépôt.
- Déterminer si la consultation expose le message et la date dans le DTO ou
  seulement les champs nécessaires à l'affichage.
- Vérifier si l'unicité `(offer_id, student_id)` doit rester absente pour permettre
  la nouvelle candidature après retrait; le service devra empêcher les doublons
  actifs même sans contrainte SQL.
