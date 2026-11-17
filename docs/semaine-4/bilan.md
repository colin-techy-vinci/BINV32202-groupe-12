## Vérification des tests EF-32 / EF-33

La relecture porte sur les tests de candidatures backend et frontend. Le tableau distingue
ce que l'assertion démontre réellement de ce qu'elle ne permet pas de conclure.

| Cas à vérifier | Test existant et assertion utile | Manque confirmé ou constat écarté |
|---|---|---|
| Refus d'une candidature à une offre non publiée | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse une candidature sur une offre non publiée et les doublons actifs`; `expect(notPublished.status).toBe(404)` ([ligne 59](../../backend/tests/applications.test.ts:59)) | **Constat écarté pour le refus HTTP** : l'API refuse bien la candidature. **Limite** : le test ne vérifie pas `error.code === "OFFER_NOT_FOUND"` pour cette offre non publiée; il vérifie ce code uniquement pour l'offre inexistante dans un autre test. |
| Refus d'une candidature déjà existante | Même test; `expect(duplicate.status).toBe(409)` ([ligne 65](../../backend/tests/applications.test.ts:65)) | **Constat écarté** : une candidature active en double est bien refusée. **Limite** : le code d'erreur `APPLICATION_EXISTS` n'est pas vérifié. |
| Retrait d'une candidature déjà traitée | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `refuse le retrait d'une candidature traitée ou d'un autre étudiant`; `expect(processed.status).toBe(409)` ([ligne 151](../../backend/tests/applications.test.ts:151)) | **Constat écarté pour le refus** : une candidature `SELECTED` ne peut pas être retirée. **Limite** : le test ne vérifie pas le code `APPLICATION_NOT_WITHDRAWABLE` ni que le statut en base reste inchangé. |
| Retrait de la candidature d'un autre étudiant | Même test; `expect(otherStudent.status).toBe(404)` ([ligne 156](../../backend/tests/applications.test.ts:156)) | **Constat écarté** : l'étudiant connecté ne peut pas retirer la candidature d'un autre étudiant. L'assertion couvre le contrôle d'appartenance appliqué par l'API. |
| Accès aux candidatures d'un autre étudiant | [`backend/tests/applications.test.ts`](../../backend/tests/applications.test.ts) — `liste uniquement les candidatures de l'étudiant connecté`; `expect(response.body).toEqual([...])` avec l'identifiant et l'offre de Lucas ([lignes 20-26](../../backend/tests/applications.test.ts:20)) | **Constat écarté** : la réponse est limitée à la candidature de l'étudiant authentifié dans les fixtures. **Limite** : le test ne vérifie pas explicitement l'absence d'un identifiant d'un autre étudiant; l'égalité exacte du tableau le garantit indirectement. |
| Création avec message facultatif | Même fichier — `crée une candidature avec un message facultatif`; statut `201`, `offerId`, message et `IN_PROGRESS` ([lignes 44-50](../../backend/tests/applications.test.ts:44)) | **Constat écarté** : le parcours nominal et le statut initial sont vérifiés. **Manque confirmé** : aucune assertion ne vérifie le cas d'un message absent ou vide, ni son stockage en `null`. |
| Validation d'un corps de candidature | Même fichier — `refuse une offre inexistante et un message invalide`; `message: 123` donne `400` et `INVALID_BODY` ([lignes 76-81](../../backend/tests/applications.test.ts:76)) | **Manque confirmé** : les corps absents/non objets, `offerId` manquant, nul, textuel ou non positif ne sont pas testés, malgré les branches de validation dédiées. |
| Affichage des quatre statuts dans l'interface | [`frontend/tests/ApplicationsPage.test.tsx`](../../frontend/tests/ApplicationsPage.test.tsx) — `affiche les statuts et retire une candidature en cours`; assertions sur `En cours`, `Non retenue` et `Retirée` ([lignes 40-45](../../frontend/tests/ApplicationsPage.test.tsx:40)) | **Manque confirmé** : le statut `SELECTED` / libellé `Retenue` n'est pas rendu dans le fixture et n'est donc pas vérifié côté frontend. |
| Candidature depuis la page des offres | [`frontend/tests/OffersPage.test.tsx`](../../frontend/tests/OffersPage.test.tsx) — le seul cas étudiant rend une liste d'offres vide et vérifie l'état vide ([lignes 40-49](../../frontend/tests/OffersPage.test.tsx:40)) | **Manque confirmé** : aucun test ne vérifie l'affichage du formulaire `Candidater`, l'envoi du message, le succès de la candidature ou la recandidature après retrait. |



{
    id: 3,
    offerId: 5,
    title: "Tableau de bord de qualité des données",
    companyShortName: "Lumen Data",
    academicYear: "2026-2027",
    period: "OTHER",
    message: null,
    status: "SELECTED",
    appliedAt: "2026-09-28 09:00:00",
  },

    expect(screen.getByText("Retenue")).toBeInTheDocument();


 FAIL  tests/OffersPage.test.tsx > OffersPage > recherche les offres par expression dans leur titre
TestingLibraryElementError: Unable to find a label with the text of: Rechercher par titre

Ignored nodes: comments, script, style
<body>
  <div>
    <section>
      <h1>
        Offres de stage
      </h1>
      <p>
        Les offres que vous avez déposées.
      </p>
      <p
        class="result-count"
      >
        2
         offre
        s
      </p>
      <div
        class="table-wrapper"
      >
        <table
          class="data-table"
        >
          <thead>
            <tr>
              <th
                scope="col"
              >
                Titre
              </th>
              <th
                scope="col"
              >
                Entreprise
              </th>
              <th
                scope="col"
              >
                Année
              </th>
              <th
                scope="col"
              >
                Période
              </th>
              <th
                scope="col"
              >
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Refonte du portail client
              </td>
              <td>
                Lumen Digital
              </td>
              <td>
                2026-2027
              </td>
              <td>
                P2
              </td>
              <td>
                <span
                  class="status-badge status-badge-warning"
                >
                  Soumise
                </span>
              </td>
            </tr>
            <tr>
              <td>
                Tableau de bord de qualité des données
              </td>
              <td>
                Lumen Data
              </td>
              <td>
                2026-2027
              </td>
              <td>
                Autre
              </td>
              <td>
                <span
                  class="status-badge status-badge-info"
                >
                  Attribuée
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</body>
 ❯ Object.getElementError ../node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ getAllByLabelText ../node_modules/@testing-library/dom/dist/queries/label-text.js:111:38
 ❯ ../node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ ../node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ tests/OffersPage.test.tsx:81:29
     79|     await screen.findByText("Refonte du portail client");
     80|
     81|     fireEvent.change(screen.getByLabelText("Rechercher par titre"), {
       |                             ^
     82|       target: { value: "  portail client  " },
     83|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  tests/OffersPage.test.tsx > OffersPage > affiche un message adapté quand la recherche ne retourne aucune offre
TestingLibraryElementError: Unable to find an element with the text: Aucune offre ne correspond à la recherche.. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <section>
      <h1>
        Offres de stage
      </h1>
      <p>
        Les offres que vous avez déposées.
      </p>
      <p
        class="state state-empty"
      >
        Aucune offre à afficher.
      </p>
    </section>
  </div>
</body>

Ignored nodes: comments, script, style
<body>
  <div>
    <section>
      <h1>
        Offres de stage
      </h1>
      <p>
        Les offres que vous avez déposées.
      </p>
      <p
        class="state state-empty"
      >
        Aucune offre à afficher.
      </p>
    </section>
  </div>
</body>
 ❯ waitForWrapper ../node_modules/@testing-library/dom/dist/wait-for.js:163:27
 ❯ ../node_modules/@testing-library/dom/dist/query-helpers.js:86:33
 ❯ tests/OffersPage.test.tsx:100:25
     98|     render(<OffersPage user={contactUser} token="jeton" onUnauthorized…
     99|
    100|     expect(await screen.findByText("Aucune offre ne correspond à la re…
       |                         ^
    101|   });
    102| });

Les tests ajoutées visaient correctement la feature demandée


(base) arnaudd.@MacBook-Pro-de-Arnaud-2 BINV32202-groupe-12 % npm 
run check

> check
> npm run lint && npm run typecheck && npm run test && npm run build


> lint
> npm run lint --workspaces


> lint
> oxlint --deny-warnings

Found 0 warnings and 0 errors.
Finished in 31ms on 63 files with 85 rules using 8 threads.

> lint
> oxlint --deny-warnings

Found 0 warnings and 0 errors.
Finished in 15ms on 54 files with 118 rules using 8 threads.

> typecheck
> npm run typecheck --workspaces


> typecheck
> tsc --noEmit


> typecheck
> tsc -b


> test
> npm run test --workspaces


> test
> vitest run


 RUN  v5.0.5 /Users/arnaudd./Documents/VInci/Informatique3/IntelligenceArti/Projet/BINV32202-groupe-12/backend

 ✓ tests/db/constraints.test.ts (21 tests) 62ms
 ✓ tests/db/seed.test.ts (20 tests) 65ms
 ✓ tests/permissions.test.ts (6 tests) 5ms
 ✓ tests/health.test.ts (2 tests) 28ms
 ✓ tests/db/migrations.test.ts (3 tests) 7ms
 ✓ tests/companies.test.ts (12 tests) 84ms
 ✓ tests/applications.test.ts (10 tests) 85ms
 ✓ tests/offers.test.ts (14 tests) 97ms
 ✓ tests/nodeVersion.test.ts (11 tests) 2ms
 ✓ tests/auth.test.ts (22 tests) 129ms

 Test Files  10 passed (10)
      Tests  121 passed (121)
   Start at  12:07:47
   Duration  444ms (import 47%, tests 31%, transform 19%, setup 2%, worker 1%)


> test
> vitest run


 RUN  v5.0.5 /Users/arnaudd./Documents/VInci/Informatique3/IntelligenceArti/Projet/BINV32202-groupe-12/frontend

 ✓ tests/ApplicationsPage.test.tsx (1 test) 213ms
 ✓ tests/HomePage.test.tsx (2 tests) 212ms
 ✓ tests/LoginPage.test.tsx (3 tests) 213ms
 ✓ tests/NavBar.test.tsx (4 tests) 229ms
 ✓ tests/App.test.tsx (5 tests) 244ms
 ✓ tests/CompaniesPage.test.tsx (6 tests) 482ms
   ✓ CompaniesPage (6)
     ✓ transmet la recherche saisie à l'API 327ms
 ✓ tests/guards.test.ts (22 tests) 4ms
 ✓ tests/OffersPage.test.tsx (6 tests) 848ms
   ✓ OffersPage (6)
     ✓ recherche les offres par expression dans leur titre 312ms
     ✓ affiche un message adapté quand la recherche ne retourne aucune offre 306ms

 Test Files  8 passed (8)
      Tests  49 passed (49)
   Start at  12:07:47
   Duration  2.34s (environment 58%, tests 19%, setup 13%, transform 5%, import 4%)


> build
> npm run build --workspaces


> build
> tsc -p tsconfig.build.json && node scripts/copyMigrations.js


> build
> tsc -b && vite build

vite v8.3.4 building client environment for production...
✓ 62 modules transformed.
computing gzip size...
dist/index.html                   0.45 kB │ gzip:  0.29 kB
dist/assets/index-CPHAIEGU.css    3.00 kB │ gzip:  1.00 kB
dist/assets/index-BDrH8gZ-.js   275.92 kB │ gzip: 86.77 kB

✓ built in 99ms



Token utilisé : 5%
Token restant : 365 tokens restant

IA utilisé : GPT-5.6 Luna