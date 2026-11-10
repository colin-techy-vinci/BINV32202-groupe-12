Bonnes pratiques enseignées dans les slides (S05 à S14)

Je me base uniquement sur le contenu des PDF, qui prolonge la synthèse S01-S04. Quand une pratique est seulement visible dans le code et pas énoncée, je le précise.

Séance 05 : Query Selector (DOM)
Savoir ce qui s’exécute où : le JS du navigateur tourne côté client, la console est dans les outils de développement (F12). Le JS du navigateur n’est pas du TypeScript (pas de typage, pas de compilation).
Charger le script après le DOM : <script> en fin de <body>, ou dans <head> avec defer.
querySelector retourne l’élément ou null. querySelectorAll retourne une NodeList, pas un Array : utiliser forEach ou Array.from() si besoin.
Manipuler le style par les classes (classList.add/remove/toggle) plutôt que par style inline (c’est ce qui est montré en priorité dans les exemples).
Sécurité XSS :
❌ innerHTML avec des données venant de l’utilisateur : un <img onerror=...> s’exécute.
✅ textContent pour les données potentiellement dangereuses, innerHTML seulement pour du HTML structuré.
Un élément créé avec createElement n’est pas visible tant qu’il n’est pas ajouté au DOM (appendChild, append, insertBefore).
Utiliser remove() (méthode moderne) pour supprimer.
Séance 06 : Gestion d’événements
Écouter avec addEventListener(event, callback).
Distinguer event.target (l’élément qui a déclenché) et event.currentTarget (celui qui porte le listener).
Pour un formulaire, appeler event.preventDefault() sur submit pour éviter le rechargement de la page. Idem pour bloquer la navigation d’un lien.
Connaître le bubbling : l’événement remonte vers les parents. stopPropagation() l’arrête.
Event delegation : un seul listener sur le parent, avec vérification de event.target. Avantages cités : moins de mémoire, et ça fonctionne pour les éléments ajoutés dynamiquement.
Choisir le bon événement : input (à chaque frappe) vs change (valeur validée).
Séance 07 : Projet Vite et premier composant React
Créer le projet avec npm create vite@latest frontend -- --template react-ts --no-eslint. Le -- est obligatoire.
Structure : src/components/ pour tout ce qui n’est pas App, un composant = une fonction qui retourne du JSX.
Nommage : majuscule initiale pour un composant ; nom du fichier = nom du composant.
Un seul composant exporté par fichier. Un fichier par composant dès qu’il est réutilisé ailleurs ou devient long.
Différences JSX/HTML : className, htmlFor, style={{...}} (objet), tags auto-fermants, un seul élément racine (ou fragment <>...</>).
React échappe le texte inséré avec {}, ce qui protège contre le XSS (lien avec S05).
Ne pas modifier main.tsx pour l’instant.
Séance 08 : Props et children
Passer les données par props plutôt que d’écrire les données en dur dans le composant.
Typer les props avec une interface nommée NomDuComposantProps.
Destructurer les props dans la signature : ({ title, duration }: RecipeCardProps). La signature montre directement ce que le composant utilise.
Syntaxe des valeurs : guillemets = toujours une string, accolades = n’importe quelle expression. duration="20" passe la chaîne "20", pas le nombre.
Props optionnelles : ? dans l’interface, avec valeur par défaut dans le destructuring ou affichage conditionnel {description && <p>...</p>}.
❌ Ne jamais modifier une prop (title = title.toUpperCase()). ✅ Calculer une variable locale. Un composant doit se comporter comme une fonction pure.
children typé ReactNode pour créer des composants conteneurs réutilisables (PageLayout, Card).
Les données descendent de parent à enfant, jamais l’inverse.
Quand découper en composants :
répétition ;
responsabilité claire ;
lisibilité (environ 50 lignes de JSX ou plus) ;
cadre réutilisable.
Mais trop découper est aussi un défaut : un composant de 3 lignes utilisé une seule fois n’apporte souvent rien.
Séance 09 : Assets, CSS et MUI
Assets :
public/ : fichiers qui gardent leur nom exact ou ne changent jamais (favicon, robots.txt) ; risque de cache si on remplace le fichier sans changer son nom.
src/assets/ : images faisant partie de l’interface, importées dans le code ; Vite vérifie leur existence au build et ajoute un hash pour invalider le cache.
Les données qui changent (photos de recettes) viennent du backend par URL.
CSS global : tout CSS importé s’applique à toute l’application, même depuis un composant. Deux composants avec le même nom de classe entrent en conflit.
CSS Modules (*.module.css) : classes locales au composant.
Style inline : réservé aux styles calculés (ex. couleur qui dépend d’une prop), pas à la mise en forme générale.
MUI :
Définir un thème (createTheme, ThemeProvider) et mettre CssBaseline.
Utiliser sx plutôt que style dans une application MUI (accès au thème).
Séparer variant (apparence) et component (balise HTML) dans Typography : un <h1> sémantique sans qu’il soit énorme.
Rating avec readOnly pour un simple affichage.
Lire la documentation et vérifier la version : beaucoup d’exemples en ligne utilisent une ancienne API (Grid item xs={6}) qui ne marche plus avec MUI v9.
Méthode : trouver le composant, copier la démo la plus proche, adapter les props, consulter l’onglet API.
Ajouter alt aux images (présent dans tous les exemples).
Séance 10 : Modules et collections
Organisation : models/ pour les types, data/ pour les données, components/ pour l’affichage.
Le modèle frontend reprend le RecipeDTO du backend.
Passer l’objet entier en prop (recipe: Recipe) plutôt que chaque champ séparément : si le modèle évolue, l’interface des props suit.
Afficher une liste avec map() qui transforme les données en JSX.
key : obligatoire sur chaque élément d’une liste.
Elle doit être unique et stable.
✅ L’identifiant unique venant des données (recipe.id).
⚠️ L’index et le titre sont acceptables seulement dans des cas rares (liste qui ne change jamais, titre unique et stable).
La key va sur le composant directement renvoyé par map, pas sur un enfant ; ce n’est pas une prop.
Sans key, React compare par position et peut perdre l’état des composants enfants.
filter() puis map() : les données restent la source de vérité, l’affichage en est déduit, et aucune des deux méthodes ne modifie le tableau.
Prévoir la liste vide avec un retour anticipé (guard clause) plutôt qu’une condition autour de tout le JSX.
Importer les types avec import type.
Séance 11 : useState
Une variable locale ne suffit pas : modifier une variable ne déclenche pas de nouveau rendu. Il faut un état (useState).
On ne manipule jamais le DOM : on change l’état, React met à jour l’affichage.
Règles des hooks :
uniquement dans un composant (ou un autre hook) ;
toujours au premier niveau ;
jamais dans un if, une boucle ou une fonction imbriquée, car React mémorise les états dans l’ordre des appels.
Convention [valeur, setValeur].
Chaque instance de composant a son propre état.
Typer l’état quand l’inférence ne suffit pas : useState<Recipe | undefined>(undefined), useState<number[]>([]).
Dans un rendu, la valeur de l’état est fixe (« photo ») : appeler le setter ne la modifie pas, il prépare le rendu suivant.
Forme fonctionnelle : quand la nouvelle valeur dépend de l’ancienne, utiliser setX((prev) => ...). Sinon setCount(count + 1) deux fois donne 1 et non 2.
Valeurs dérivées : calculer pendant le rendu au lieu de les stocker dans un état (❌ useState(servings / recipe.servings), ✅ const ratio = servings / recipe.servings).
Un état par information qui change indépendamment des autres.
Accessibilité : aria-label sur un bouton sans texte (IconButton).
Déduire l’état d’un bouton (disabled={servings <= 1}) plutôt que de le gérer à la main.
Séance 12 : Événements et formulaires
Passer la fonction, ne pas l’appeler : ✅ onClick={handleDelete} ou onClick={() => handleDelete(id)}, ❌ onClick={handleDelete()} (exécuté pendant le rendu).
Conventions de nommage : événement click, attribut onClick, handler handleClick.
Typer les événements avec les types de "react" importés avec import type (ChangeEvent, SubmitEvent, MouseEvent). Sans l’import, ce sont les types natifs du DOM qui sont utilisés.
SubmitEvent remplace FormEvent, déprécié récemment.
Champs contrôlés (value + onChange) : l’état est la seule source de vérité. Cela permet validation en direct, compteur, réinitialisation facile.
e.target.value est toujours une chaîne, même pour type="number". On garde des chaînes dans l’état du formulaire et on convertit en nombre une seule fois, à la soumission. Pour une case à cocher : checked et e.target.checked.
onSubmit sur le <form> (pas onClick sur le bouton), car ça fonctionne aussi avec Entrée. Ne pas oublier preventDefault().
Utiliser aussi la validation HTML native (required, min, max, type="email").
État objet pour un grand formulaire, mis à jour de façon immuable : setForm({ ...form, [name]: value }), avec un seul handler pour tous les champs (l’attribut name correspond à la propriété).
Validation : erreurs déduites de l’état, affichées seulement après la première soumission (submitted).
⚠️ La validation du frontend améliore l’expérience mais ne remplace pas celle du backend.
Séance 13 : Collection comme état
Pour que la liste change à l’écran, elle doit être un état : useState<Recipe[]>(initialRecipes).
Savoir que === et Object.is comparent les références. React détecte un changement par cette comparaison.
L’état est immuable : on ne le modifie jamais, on le remplace par une nouvelle valeur.
❌ recipes.push(r); setRecipes(recipes) (même référence, pas de rendu).
✅ Ajouter : [...recipes, x]. Supprimer : filter. Modifier : map avec { ...recipe, title } pour l’élément concerné.
Modifier l’objet lui-même dans un map (r.title = title) est aussi une mutation.
Éviter les méthodes qui mutent (push, splice, sort, reverse, arr[i] = x) et utiliser les alternatives (toSorted(), [...arr].sort()...).
Identifiants :
Math.max(...) + 1 : réutilise l’id d’une recette supprimée si c’était la plus grande, et donne -Infinity sur une liste vide.
Date.now() : suffit si on ne crée pas plusieurs recettes dans la même milliseconde.
crypto.randomUUID() : plus sûr, mais impose un id: string.
Ce sont des identifiants temporaires : c’est le backend qui attribuera l’id en Partie 4.
Tableau d’objets dans un formulaire : un identifiant local (key) par ligne pour la key React.
Typer les noms de champs modifiables avec une union de chaînes littérales ("name" | "quantity" | "unit").
Séance 14 : État partagé
Flux unidirectionnel : les données descendent par les props, les événements remontent via des fonctions passées en props.
Lifting state up : si deux composants partagent une donnée, la placer dans leur plus proche parent commun, et passer la valeur ou la fonction aux enfants.
Une fonction en prop : le parent la crée et modifie son état, l’enfant l’appelle sans savoir ce qu’elle fait. Convention onXxx pour la prop (onDelete, onAdd), type (id: number) => void.
Cela rend le composant réutilisable (ailleurs, onDelete pourrait demander confirmation ou appeler le serveur).
Composant contrôlé par son parent (SearchBar avec value et onChange) : le composant n’a plus d’état propre.
Source de vérité unique : chaque donnée est stockée à un seul endroit.
État ou valeur dérivée ? Se demander « peut-on le calculer à partir des props ou d’un autre état ? ». Si oui, ce n’est pas un état (❌ deux états recipes et filteredRecipes à synchroniser à la main, ✅ un état et un filter à chaque rendu).
Où placer un état : état local si un seul composant l’utilise, sinon dans le plus proche parent commun, mais le plus bas possible (trop haut = rendus inutiles et props en cascade).
Prop drilling : supportable sur 2 ou 3 niveaux, pénible au-delà. Dans MiamMiam, les props suffisent (le Context est vu plus tard).
Utiliser null pour représenter « aucun filtre » (categoryId: number | null).
Le parent complète les données (id, authorId) via un type comme Omit<Recipe, "id" | "authorId">.
L’exercice demande de réfléchir au fait que recharger la page remet la liste de départ (l’état est en mémoire, pas persistant).
Bonnes pratiques transversales (S05-S14)
Sécurité : jamais de données utilisateur dans innerHTML (S05), React échappe le texte (S07), la validation frontend ne remplace pas celle du backend (S12).
Immuabilité : const, props en lecture seule, état remplacé et jamais muté, méthodes non mutantes (map, filter, spread).
Typage strict : interfaces de props (NomDuComposantProps), états typés explicitement quand l’inférence ne suffit pas, événements typés depuis "react".
Un seul endroit pour chaque donnée : valeurs dérivées calculées, jamais dupliquées dans un état.
Composants : un fichier par composant, responsabilité claire, ni trop gros ni trop petits.
Fonctions pures : un composant avec les mêmes props donne le même affichage.
Lisibilité : destructuring des props, conventions de nommage (onXxx, handleXxx, [valeur, setValeur]).

---

