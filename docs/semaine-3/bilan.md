# Bilan — guides et senseurs du dépôt

## Matrice de classification

|  | **Feedforward — Guide** | **Feedback — Senseur** |
|---|---|---|
| **Inférentiel** | **Instructions Copilot** — [`.github/copilot-instructions.md](../../.github/copilot-instructions.md)<br>Donne les consignes d’architecture, de sécurité, de style et de validation à l’agent. Exemple : les contrôleurs ne doivent pas contenir de règles métier. Consulté pendant la séance, mais non exécuté comme un programme.<br><br>**Documentation du projet** — [`README.md`](../../README.md), [`docs/architecture.md`](../architecture.md), [`docs/cdc_gesta_developpement.md`](../cdc_gesta_developpement.md)<br>Décrit les exigences métier et les conventions d’organisation. Exemple : une évolution du schéma doit passer par une nouvelle migration. Consultée pendant la séance, non exécutée.<br><br>**Modèle de pull request** — [`.github/pull_request_template.md`](../../.github/pull_request_template.md)<br>Guide la revue humaine avec des points de contrôle sur les tests, les droits et la documentation. Consulté, sans création de PR pendant la séance. | Aucun mécanisme de revue de code par IA ou de senseur inférentiel local n’a été identifié. |
| **Computationnel** | **Configuration TypeScript et Oxlint** — [`backend/tsconfig.json`](../../backend/tsconfig.json), [`frontend/tsconfig.app.json`](../../frontend/tsconfig.app.json), [`backend/.oxlintrc.json`](../../backend/.oxlintrc.json), [`frontend/.oxlintrc.json`](../../frontend/.oxlintrc.json)<br>Impose notamment le mode strict, l’absence de variables inutilisées, l’interdiction de `any`, `eqeqeq` et les règles React Hooks. Configurée et exécutée par la validation globale.<br><br>**Scripts npm** — [`package.json`](../../package.json)<br>Définit la chaîne `lint → typecheck → test → build`. Configurée et exécutée pendant la séance.<br><br>**Garde de version Node** — [`backend/src/nodeVersion.ts`](../../backend/src/nodeVersion.ts), [`backend/src/requireSupportedNode.ts`](../../backend/src/requireSupportedNode.ts)<br>Refuse les versions incompatibles, notamment les versions Node antérieures à 22.14. Configurée et vérifiée par les tests backend. | **Oxlint** — `npm run lint` : réussi sans erreur ni avertissement.<br><br>**TypeScript** — `npm run typecheck` : réussi pour les deux workspaces.<br><br>**Vitest** — `npm test` : 113 tests backend réussis dans 10 fichiers et 47 tests frontend réussis dans 8 fichiers. Les tests vérifient notamment les réponses 401/403/404, les permissions, les contraintes SQLite, les migrations et l’interface.<br><br>**Build** — `npm run build` : compilation backend et build frontend Vite réussis.<br><br>La commande globale `npm run check` a été exécutée pendant la séance et a entièrement réussi. |

## Autres senseurs computationnels

- Les tests de migration et de contraintes SQLite dans [`backend/tests/db/`](../../backend/tests/db/) vérifient l’application unique des migrations, les clés étrangères, les unicités et les valeurs autorisées.
- Les fichiers de requêtes REST dans [`backend/http/`](../../backend/http/) sont des sondes manuelles de l’API. Ils sont présents et configurés, mais n’ont pas été exécutés pendant la séance.

## Conclusion

Le dépôt contient des guides feedforward explicites, principalement les instructions Copilot et la documentation du projet. Ses senseurs feedback les plus importants sont computationnels : Oxlint, TypeScript, Vitest, les contraintes SQLite et le build. Aucun senseur inférentiel automatisé local n’a été trouvé.

## Traçabilité EF-32 / EF-33

Le cahier des charges définit [EF-32](../cdc_gesta_developpement.md#74-consultation-et-candidature-des-étudiants) comme la candidature d’un étudiant à une offre publiée, avec message facultatif, et le retrait tant que la candidature n’est pas traitée. [EF-33](../cdc_gesta_developpement.md#74-consultation-et-candidature-des-étudiants) concerne la consultation par l’étudiant de ses candidatures et de leurs statuts. Les tests ci-dessous vérifient effectivement le résultat attendu, et non les seuls appels de routes.

### Matrice de traçabilité des tests et des manques

| Exigence | Cas à vérifier | Test existant (fichier et nom) | Assertions utiles | Couverture |
|---|---|---|---|---|
| EF-32 | Un étudiant candidate à une offre publiée avec un message facultatif | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `crée une candidature avec un message facultatif` | `response.status` vaut `201`; le corps contient `offerId`, le message envoyé et `status: "IN_PROGRESS"` | **Couvert** |
| EF-32 | Une offre non publiée n’accepte pas de candidature | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse une candidature sur une offre non publiée et les doublons actifs` | `notPublished.status` vaut `404` | **Couvert** |
| EF-32 | Une offre inexistante n’accepte pas de candidature | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse une offre inexistante et un message invalide` | `missingOffer.status` vaut `404`; le code vaut `OFFER_NOT_FOUND` | **Couvert** |
| EF-32 | Un corps invalide ou un message non valide est refusé | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse une offre inexistante et un message invalide` | `invalidMessage.status` vaut `400`; le code vaut `INVALID_BODY` pour un message non textuel | **Partiel** |
| EF-32 | Un corps absent ou un `offerId` invalide est refusé | Aucun test dédié | Aucune assertion sur `INVALID_BODY` pour un corps absent ou un identifiant non positif | **Absent** |
| EF-32 | Une candidature active en double est refusée | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse une candidature sur une offre non publiée et les doublons actifs` | `duplicate.status` vaut `409` | **Couvert** |
| EF-32 | Une nouvelle candidature est possible après retrait | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `retire une candidature en cours et permet de recandidater` | Le retrait vaut `204`; la nouvelle candidature vaut `201` | **Couvert** |
| EF-32 | Une candidature `IN_PROGRESS` peut être retirée | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `retire une candidature en cours et permet de recandidater` | `withdrawal.status` vaut `204` | **Couvert** |
| EF-32 | Une candidature traitée ne peut pas être retirée | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse le retrait d'une candidature traitée ou d'un autre étudiant` | `processed.status` vaut `409` | **Couvert** |
| EF-32 | Un étudiant ne peut pas retirer la candidature d’un autre étudiant | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse le retrait d'une candidature traitée ou d'un autre étudiant` | `otherStudent.status` vaut `404` | **Couvert** |
| EF-32 | Un profil non étudiant ne peut pas gérer des candidatures | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse l'accès aux profils non étudiants` et `refuse les opérations de candidature d'un profil non étudiant` | `response.status`, `create.status` et `withdraw.status` valent `403` sur `GET`, `POST` et `DELETE` | **Couvert** |
| EF-33 | Un étudiant consulte ses candidatures | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `liste uniquement les candidatures de l'étudiant connecté` | `response.status` vaut `200`; le corps est exactement la candidature de Lucas, avec son offre, son titre et `status: "IN_PROGRESS"` | **Couvert** |
| EF-33 | Un étudiant ne voit pas les candidatures d’un autre étudiant | Même test — `liste uniquement les candidatures de l'étudiant connecté` | `response.body` vaut exactement un tableau contenant uniquement `APPLICATION.LUCAS_FLEET_APP` | **Couvert** |
| EF-33 | Les quatre statuts sont affichés avec leurs libellés attendus | [`frontend/tests/ApplicationsPage.test.tsx`](../../frontend/tests/ApplicationsPage.test.tsx) — `affiche les statuts et retire une candidature en cours` | Le texte `En cours` et `Non retenue` est trouvé; après retrait, `Retirée` est trouvé et le bouton disparaît | **Partiel** |
| EF-33 | Le statut `SELECTED` / « Retenue » est renvoyé par l’API | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `retourne le statut retenu dans la liste des candidatures` | Le corps contient la candidature de Mateusz avec `status: "SELECTED"` | **Couvert** |
| EF-33 | Le statut `SELECTED` est traduit visuellement en « Retenue » | Aucun test frontend dédié | Aucune assertion sur le texte `Retenue` dans `ApplicationsPage.test.tsx` | **Absent** |
| EF-33 | La liste est limitée à l’année académique courante | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `ne liste que les candidatures de l'année académique courante` | Une candidature 2025-2026 ajoutée pour Lucas est exclue; la réponse contient une seule candidature `academicYear: "2026-2027"` | **Couvert** |
| EF-33 | Un profil non étudiant ne peut pas consulter cette liste | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse l'accès aux profils non étudiants` | `response.status` vaut `403` | **Couvert** |

### Matrice des tests ajoutés

| Exigence | Cas vérifié | Test ajouté | Assertions utiles | Couverture |
|---|---|---|---|---|
| EF-32 | Une offre inexistante n’accepte pas de candidature | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse une offre inexistante et un message invalide` | `missingOffer.status` vaut `404`; le code vaut `OFFER_NOT_FOUND` | **Couvert** |
| EF-32 | Un message non textuel est refusé | Même test | `invalidMessage.status` vaut `400`; le code vaut `INVALID_BODY` | **Couvert pour ce cas** |
| EF-32 | Un profil non étudiant ne peut pas créer une candidature | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse les opérations de candidature d'un profil non étudiant` | `create.status` vaut `403` pour `POST /applications` | **Couvert** |
| EF-32 | Un profil non étudiant ne peut pas retirer une candidature | Même test | `withdraw.status` vaut `403` pour `DELETE /applications/:id` | **Couvert** |
| EF-33 | La liste exclut une candidature d’une année ancienne | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `ne liste que les candidatures de l'année académique courante` | La candidature 2025-2026 ajoutée dans le test est absente; la réponse contient seulement l’année `2026-2027` | **Couvert** |
| EF-33 | L’API renvoie le statut `SELECTED` | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `retourne le statut retenu dans la liste des candidatures` | La réponse contient la candidature de Mateusz avec `status: "SELECTED"` | **Couvert API** |

### Comportements testés hors EF-32 / EF-33

Ces tests sont utiles, mais ne doivent pas être rattachés artificiellement aux deux exigences :

- [`frontend/tests/OffersPage.test.tsx`](../../frontend/tests/OffersPage.test.tsx) — `affiche les offres avec leurs libellés français` vérifie l’affichage général des offres et leurs statuts, pas la candidature d’un étudiant.
- [`frontend/tests/OffersPage.test.tsx`](../../frontend/tests/OffersPage.test.tsx) — `adapte la description au profil` et `affiche un refus d'accès renvoyé par le backend` vérifient la page des offres, pas EF-33.
- [`frontend/tests/ApplicationsPage.test.tsx`](../../frontend/tests/ApplicationsPage.test.tsx) — le retrait vérifie aussi le rafraîchissement visuel : le bouton `Retirer` disparaît après passage à `Retirée`. Cette assertion confirme le comportement d’interface, mais ne prouve pas à elle seule la persistance backend.
- [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — le refus d’accès d’un administrateur confirme une règle d’autorisation générale de la route ; il ne vérifie pas toutes les variantes de méthode HTTP.

### Bilan de couverture

Les parcours principaux d’EF-32 sont couverts par l’API : candidature acceptée, offre non publiée ou inexistante refusée, doublon refusé, retrait autorisé ou refusé selon le statut et autorisation sur les méthodes de lecture et d’écriture. EF-33 est couvert côté API pour l’isolation entre étudiants, le filtrage sur l’année courante et les quatre codes de statut via les fixtures et tests ciblés. La validation du corps reste **partielle** : le message non textuel est testé, mais pas toutes les formes de corps ou toutes les limites de longueur. La traduction visuelle « Retenue » reste à vérifier côté frontend ; ce point n’a pas été refait en end-to-end.

## Tests ajoutés et défauts détectés

Les tests ajoutés dans [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) échoueraient notamment si :

- le service acceptait une offre inconnue, acceptait un `message` numérique ou renvoyait un mauvais code HTTP ;
- `authorize(canManageApplications)` ne protégeait que `GET` et laissait un administrateur créer ou retirer une candidature ;
- la requête de consultation supprimait le filtre `ay.is_current = 1` et retournait une candidature de 2025-2026 ;
- le mapper ne conservait pas le statut `SELECTED` dans la réponse API.

La suite ciblée a confirmé ces comportements dans l’état actuel sans modifier le code de production. Aucune vérification manuelle navigateur ou end-to-end n’a été nécessaire pour ces cas API ; la traduction frontend de « Retenue » reste une limite signalée ci-dessus.