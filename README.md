Yum&GO — Meal planning companion
================================

Application React moderne pour planifier ses repas, générer une liste de courses, explorer des recettes et gérer ses préférences alimentaires.

Fonctionnalités principales
---------------------------
- Planificateur de repas: ajoute des recettes à des jours et créneaux (breakfast/lunch/dinner)
- Recettes: recherche et filtres (durée, régime) via l’API Spoonacular, avec repli local si la clé manque/erreur
- Liste de courses: liste auto depuis le plan, cases à cocher, progression, export CSV et export PDF natif (jsPDF)
- Onboarding: page d’accueil colorée et personnalisable, préférences (régime, allergies, nombre de repas/jour)
- Auth simplifiée (Register/Login, routes protégées) 
- Design mobile-first avec `MobileFrame`, palette moderne 
Stack & exigences
-----------------
- React (Create React App), React Router
- jsPDF (export PDF)
- Axios (HTTP)
- Node.js 

Installation
------------
1) Cloner le dépôt et entrer dans le dossier:
```bash
git clone https://github.com/lo-riana/yum-and-go.git
cd yum-and-go
```
2) Installer les dépendances:
```bash
npm install
```
3) Créer le fichier `.env` à la racine:
```dotenv
REACT_APP_SPOONACULAR_API_KEY=VOTRE_CLE_ICI
```
Notes:
- Créer un compte Spoonacular
- Sans clé ou en cas d’erreur API, l’app utilise des données mock pour rester fonctionnelle

Lancer en développement
----------------------
Port par défaut: `3000`.

Windows PowerShell:
```powershell
# Si le port 3000 est occupé, lancez sur 3001
$env:PORT=3001; npm start
```
CMD:
```bash
npm start
```
Ouvrez ensuite `http://localhost:3000` (ou `http://localhost:3001`).


Infos techniques
----------------
- API `src/utils/spoonacularApi.js`
  - `searchRecipes(query, filters)` et `getRecipeDetails(id)`
  - Repli mock si `REACT_APP_SPOONACULAR_API_KEY` absent/invalide
- Export CSV (Groceries): fichier UTF-8 avec BOM, compatible Excel
- Export PDF (Groceries): génération directe avec jsPDF (`grocery-list-YYYY-MM-DD.pdf`)
- Styles globaux/palette: `src/App.css`, styles par page dans `src/components/*.css`

Structure
---------
- `src/components/Onboarding.*` — accueil + préférences
- `src/components/Recipes.*` — recherche recettes
- `src/components/Planner.*` — planificateur
- `src/components/Groceries.*` — courses + export CSV/PDF
- `src/contexts/*` — états utilisateur/auth
- `src/utils/spoonacularApi.js` — API + mock

Déploiement
---------
https://yum-and-go.vercel.app/
