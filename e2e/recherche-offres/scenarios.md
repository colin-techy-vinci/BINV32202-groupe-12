# Scenarios E2E - Recherche d'offres

## 1. Recherche nominale avec resultat

**Etat initial**

- Serveur local demarre avec les donnees de demonstration recreees par `npm run setup` ou `npm run db:reset`.
- Se connecter en mode demo avec le role `STUDENT`, sous l'utilisateur `Lucas Dupont`.
- L'annee academique courante est `2026-2027`.
- Les offres suivantes sont necessaires :
  - `API REST de facturation`, entreprise `Orbis`, periode `P2`, statut `PUBLISHED` ;
  - `Application React de gestion de flotte`, entreprise `Lumen Digital`, periode `P2`, statut `PUBLISHED`.
- Cette recherche doit partir d'une liste initiale contenant uniquement les offres publiees visibles par Lucas.

**Actions dans l'interface**

1. Ouvrir la page `Offres de stage`.
2. Verifier que la description affiche `Les offres publiees.`.
3. Dans le champ `Rechercher par titre`, saisir exactement `  api rest  `.

**Resultat attendu**

- La recherche est envoyee apres le delai de saisie avec l'expression nettoyee `api rest`.
- Seule l'offre `API REST de facturation` est affichee.
- La ligne affiche `Orbis`, `2026-2027`, `P2` et le statut en francais `Publiée`.
- Le compteur affiche `1 offre`.
- L'offre `Application React de gestion de flotte` n'est pas affichee.

## 2. Recherche sans resultat visible

**Etat initial**

- Serveur local demarre avec les donnees de demonstration recreees par `npm run setup` ou `npm run db:reset`.
- Se connecter en mode demo avec le role `STUDENT`, sous l'utilisateur `Lucas Dupont`.
- Les offres suivantes sont necessaires :
  - `Refonte du portail client`, entreprise `Lumen Digital`, periode `P2`, statut `SUBMITTED` ;
  - `API REST de facturation`, entreprise `Orbis`, periode `P2`, statut `PUBLISHED`.
- La page affiche par defaut uniquement les offres publiees. `Refonte du portail client` est donc deja invisible pour Lucas avant meme la saisie.

**Actions dans l'interface**

1. Ouvrir la page `Offres de stage`.
2. Dans le champ `Rechercher par titre`, saisir `portail client`.

**Resultat attendu**

- Le champ conserve la saisie `portail client`.
- Aucune ligne d'offre n'est affichee.
- Le compteur d'offres n'est pas affiche.
- La page affiche exactement le message `Aucune offre ne correspond à la recherche.`
- `Refonte du portail client` reste absente, meme si son titre correspond au texte saisi, car elle est soumise et pas visible par un etudiant.
- `API REST de facturation` reste absente, car elle ne correspond pas au texte saisi.
