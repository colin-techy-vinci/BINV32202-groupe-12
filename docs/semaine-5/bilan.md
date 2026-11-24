# Résultat

Le scénario 1 n’a pas pu être exécuté dans l’interface.

## Actions réellement effectuées

- Tentative de démarrage de l’application avec `npm.cmd run dev`.
- L’API a démarré sur http://localhost:3000.
- Vérification que le port 5173 était déjà utilisé.
- Tentative d’ouverture de http://localhost:5173 puis http://127.0.0.1:5173 avec Playwright.
- Activation de Computer Use et nouvelle tentative d’accès.

## Observations et écarts

- Le navigateur intégré refuse toutes les adresses loopback avec une restriction réseau.
- Playwright ne dispose pas du binaire Chromium dans cette session.
- Aucune action dans l’application ni sélection de Lucas Dupont n’a pu être réalisée.
- Aucun écart fonctionnel du scénario ne peut être conclu.
- Aucun fichier ou code de l’application n’a été modifié.

---

# Scénario 1 : Recherche nominale avec résultat

**Statut : réussi**

## Actions effectuées

- Sélection de Lucas Dupont en mode étudiant.
- Ouverture de la page Offres.
- Saisie de `api rest` dans Rechercher par titre.

## Observations

- Le champ conserve bien les espaces autour de l’expression.
- Le compteur affiche `1 offre`.
- Une seule ligne est affichée :
  - Titre : API REST de facturation
  - Entreprise : Orbis
  - Année : 2026-2027
  - Période : P2
  - Statut : Publiée
- Application React de gestion de flotte n’est plus affichée.

## Écarts

Aucun écart constaté avec le scénario 1.

---

# appmod-debug-app-in-browser

## Attente de la page

**Paramètres :** URL http://localhost:5173, action wait sur body.

**Informations renvoyées :** HTML complet de la page, titre Gesta, écran de connexion avec les utilisateurs fictifs et notamment Lucas Dupont.

**Usage :** vérifier que l’application locale était accessible.

## Sélection de l’utilisateur

**Paramètres :** clic sur le bouton correspondant à Lucas Dupont.

**Informations renvoyées :** HTML de la page d’accueil, avec le nom Lucas Dupont, le profil Étudiant et les liens de navigation.

## Ouverture des offres

**Paramètre :** clic sur le sélecteur `a[href='/offres']`.

**Informations renvoyées :** page complète des offres, description Les offres publiées., champ de recherche et tableau initial contenant 4 offres.

## Saisie et vérifications

**Paramètres :** saisie de `"  api rest  "` dans `input[type='search']`, attente de 1 seconde, puis validations du compteur et des colonnes.

**Informations renvoyées :**

- compteur : `1 offre`
- ligne : `API REST de facturation`
- entreprise : `Orbis`
- année : `2026-2027`
- période : `P2`
- statut : `Publiée`

Ce résultat confirmait que la recherche avait filtré correctement la liste.

L’appel openBrowserPage avec http://127.0.0.1:5173 a également été tenté, mais la politique réseau l’a bloqué avant toute navigation. Les appels réels utilisés pour l’exécution finale correspondaient donc à l’outil VS Code appmod-debug-app-in-browser, avec des actions équivalentes à browser_navigate, browser_click, browser_type et browser_snapshot.

# Playwright Test : fichier recherche-offres.spec.ts créé

```text
techy@DESKTOP-2O4C5NO MINGW64 ~/Desktop/BINV32202-groupe-12 (main)
$ npx playwright test --headed

Running 12 tests using 8 workers
  12 passed (12.7s)

To open last HTML report run:

  npx playwright show-report
```

```text
techy@DESKTOP-2O4C5NO MINGW64 ~/Desktop/BINV32202-groupe-12 (main)
$ npx playwright test --headed

Running 12 tests using 8 workers
  12 passed (12.5s)

To open last HTML report run:

  npx playwright show-report
```

```text
RUN  v5.0.5 C:/Users/techy/Desktop/BINV32202-groupe-12/backend

 ❯ tests/applications.test.ts [queued]
 ❯ tests/auth.test.ts [queued]
 ✓ tests/permissions.test.ts (6 tests) 5ms
 ✓ tests/nodeVersion.test.ts (11 tests) 7ms
 ✓ tests/db/migrations.test.ts (3 tests) 14ms

 ✓ tests/db/constraints.test.ts (21 tests) 95ms
 ✓ tests/db/seed.test.ts (20 tests) 95ms
 ✓ tests/health.test.ts (2 tests) 43ms
 ✓ tests/companies.test.ts (12 tests) 140ms
 ✓ tests/offers.test.ts (14 tests) 148ms
 ✓ tests/applications.test.ts (10 tests) 148ms
 ✓ tests/auth.test.ts (22 tests) 204ms

 Test Files  10 passed (10)
      Tests  121 passed (121)
   Start at  13:13:52
   Duration  882ms (import 47%, transform 27%, tests 21%, setup 3%, worker 2%)
```

```text
> test
> vitest run

 RUN  v5.0.5 C:/Users/techy/Desktop/BINV32202-groupe-12/frontend

 ✓ tests/guards.test.ts (22 tests) 9ms
 ✓ tests/NavBar.test.tsx (4 tests) 174ms
 ✓ tests/HomePage.test.tsx (2 tests) 174ms
 ✓ tests/ApplicationsPage.test.tsx (1 test) 209ms
 ✓ tests/LoginPage.test.tsx (3 tests) 257ms
 ✓ tests/App.test.tsx (5 tests) 304ms
 ✓ tests/CompaniesPage.test.tsx (6 tests) 537ms
   ✓ CompaniesPage (6)
     ✓ transmet la recherche saisie à l'API 340ms
 ✓ tests/OffersPage.test.tsx (6 tests) 892ms
   ✓ OffersPage (6)
     ✓ recherche les offres par expression dans leur titre 344ms
     ✓ affiche un message adapté quand la recherche ne retourne aucune offre 306ms

 Test Files  8 passed (8)
      Tests  49 passed (49)
   Start at  13:13:54
   Duration  3.38s (environment 69%, setup 13%, tests 12%, transform 5%, instrument 1%)
```

```text
> build
> npm run build --workspaces

> build
> tsc -p tsconfig.build.json && node scripts/copyMigrations.js

> build
> tsc -b && vite build

vite v8.3.4 building client application
✓ 62 modules transformed.
computing gzip size...
dist/index.html                   0.46 kB
dist/assets/index-CPHAIEGU.css    3.00 kB
dist/assets/index-CPHAIEGU.js     275.92 kB

✓ built in 135ms
```

# Vérification

`default` introduit sur la page offre changement du label :

```tsx
return (
    <section>
      <h1>Offres de stage</h1>
      <p>{DESCRIPTIONS[user.kind]}</p>
      <SearchField label="Rechercher par tit" value={search} onChange={setSearch} />
      {renderContent()}
    </section>
```

```text
1) [chromium] › e2e\recherche-offres\recherche-offres.spec.ts:14:1 › Scénario 1 - recherche nominale avec une offre publiée

    Test timeout of 30000ms exceeded.

    Error: page.waitForResponse: Test timeout of 30000ms exceeded.

      18 |   await expect(page.getByText("4 offres", { exact: true })).toBeVisible();
      19 |
    > 20 |   const searchResponse = page.waitForResponse(
      21 |     (response) =>
      22 |       response.url().includes("/api/offers") &&
      23 |       new URL(response.url()).searchParams.get("q") === "api rest",
        at C:\Users\techy\Desktop\BINV32202-groupe-12\e2e\recherche-offres\recherche-offres.spec.ts:20:31

    Error: locator.fill: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for getByRole('searchbox', { name: 'Rechercher par titre' })
```

# 1. Que permet Playwright MCP dans la conversation avec l’agent ? Quelle action précise avez-vous vu passer par un outil MCP ?

MCP donne à l'agent des outils pour piloter un vrai navigateur. Sans MCP, il ne peut que lire et écrire du code. Avec MCP, il peut agir sur l'application et observer le résultat pendant la conversation.

appmod-debug-app-in-browser

```json
{
  "actionType": "click",
  "selector": "a[href='/offres']",
  "actionValue": ""
}
```

# 2. Qu’apportent les scripts Playwright Test que le compte rendu d’un test par MCP n’apporte pas ?

Un compte rendu MCP est un récit produit par un LLM. Un script de test est un artefact exécutable et vérifiable.

Reproductibilité : le script fait exactement la même chose à chaque exécution. L'agent, lui, peut agir différemment d'une fois à l'autre (non déterministe).

Automatisation / CI : le script tourne à chaque commit, sans humain ni LLM, et détecte les régressions.

Traçabilité : le script est versionné dans Git, relu en code review, et produit des rapports, des traces et des captures en cas d'échec.

# 3. Dans quel cas préféreriez-vous une exploration interactive avec MCP ? Dans quel cas préféreriez-vous un test automatisé ?

L'exploration interactive avec MCP convient pour :

- découvrir une application ou une fonctionnalité nouvelle, sans parcours encore figé ;
- préparer un futur test : l'exploration aide à repérer les sélecteurs et les étapes, avant d'écrire le script.

Le test automatisé convient pour :

- les parcours critiques à vérifier à chaque version (recherche d'offres, connexion, paiement…) ;
- la non-régression et l'intégration continue ;
- quand il faut une preuve fiable et répétable, partageable avec l'équipe ;


