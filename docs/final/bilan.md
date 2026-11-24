# Bilan — Intelligence artificielle pour développeurs

## Phase 1 — Cahier des charges

### Ce que j’ai appris

Nous avons appris les différentes commandes permettant d’initialiser une IA afin qu’elle
dispose du contexte général du projet. Cette initialisation crée un fichier Markdown contenant
les informations et les règles apprises par l’IA.

Nous avons également constaté que l’IA peut produire une analyse plus détaillée que celle
explicitement demandée.

### Ce qui a bien fonctionné

- L’initialisation de l’IA a fourni un contexte de départ utile.
- Cependant, l’IA a parfois anticipé les étapes suivantes et tenté d’installer Playwright ainsi
  qu’un serveur pour les tests end-to-end.

### Ce qui a moins bien fonctionné

Aucun autre problème particulier n’a été signalé à ce stade.

## Phase 2 — Premier contact avec les agents de codage

**Résultat :** l’utilisation des agents de codage a été fluide et aucune difficulté majeure n’a
été rencontrée.

### Validation fonctionnelle

- Visualisation des candidatures : OK
- Retrait d’une candidature : OK
- Candidature à une offre : OK
- Changement d’état d’une candidature : OK

### Qualité

La qualité générale est correcte. Le processus de candidature à une offre doit toutefois être
retravaillé sur le frontend afin d’être plus visible, plus attrayant et plus intuitif.

## Phase 3 — Une fonctionnalité complète

La commande `/plan` a été utilisée pour préparer et structurer l’implémentation d’une
fonctionnalité complète.

## Phase 4 — Harness Engineering

Un harnais agentique combine deux familles de mécanismes :

- les **guides** (*feedforward*) orientent l’agent avant et pendant son travail ;
- les **senseurs** (*feedback*) lui fournissent un retour sur le résultat produit.

## Phase 5 — Skills, hooks et fenêtre de contexte

Nous avons appris à utiliser :

- les **skills**, qui contiennent une méthode et des références utiles ;
- les **hooks**, qui peuvent examiner l’appel d’une fonction avant son exécution ;
- la gestion de la **fenêtre de contexte**, afin de conserver les informations pertinentes.

## Phase 6 — ADR, MCP et tests end-to-end Playwright

Nous avons appris à :

- mettre en place un serveur MCP Playwright ;
- faire fonctionner ce serveur sans que l’agent sorte de son environnement isolé ;
- créer et exécuter des tests end-to-end avec Playwright ;
- distinguer les usages de MCP et des scripts Playwright Test, en tenant compte de leur utilité
  respective.
