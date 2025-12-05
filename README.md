

# 🛒 EROLS Frontend – React + TypeScript + Tailwind

**Plateforme :** EROLS EasyBuy – Le marché chinois à votre porte
**Entreprise :** VisionTech

---

## ⭐ 1. Présentation du projet

Le frontend **EROLS EasyBuy** est l’interface utilisateur officielle qui permet aux clients et aux fournisseurs locaux de :

* Explorer les produits chinois et locaux
* Ajouter au panier et passer des commandes
* Suivre le statut des livraisons en temps réel
* Créer et gérer leurs boutiques sur la marketplace
* Recevoir des notifications et mises à jour en direct

Il est construit avec **React**, **TypeScript** et **Tailwind CSS** pour offrir une expérience rapide, responsive et moderne.

---

## 📁 2. Structure du projet

```text
erols_frontend/
├── node_modules/
├── public/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── contexts/       # Context API (Auth, Cart, etc.)
│   ├── lib/           # Utilitaires, API calls
│   ├── pages/         # Pages de l'app
│   ├── types/         # Types TypeScript
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🧰 3. Technologies utilisées

* **React** (v18+)
* **TypeScript**
* **Tailwind CSS**
* **React Router DOM**
* **Axios / Fetch** (pour les appels API)
* **Redux / Zustand** (optionnel, gestion d’état)
* **React Query** (optionnel, data fetching)
* **Netlify** (déploiement)

---

## 🚀 4. Installation & exécution (mode développement)

1️⃣ Cloner le projet :

```bash
git clone https://github.com/visiontechft/EROLS_frontend.git
cd erols_frontend
```

2️⃣ Installer les dépendances :

```bash
npm install
# ou
yarn install
```

3️⃣ Lancer le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

4️⃣ Ouvrir le navigateur sur :

```
http://localhost:5173
```

5️⃣ Modifier `.env` si nécessaire pour connecter le frontend à l’API backend :

```
VITE_API_URL=http://localhost:8000/api
```

---

## 📦 5. Scripts disponibles

* `npm run dev` – Démarrer le serveur de développement
* `npm run build` – Compiler pour la production
* `npm run preview` – Prévisualiser la build de production
* `npm run lint` – Lancer linter avec ESLint
* `npm run format` – Formater le code avec Prettier

---

## 🌐 6. Déploiement sur Netlify

1️⃣ Créer un compte Netlify et connecter votre dépôt GitHub.
2️⃣ Définir les **Build Settings** :

* **Build command :** `npm run build`
* **Publish directory :** `dist`

3️⃣ Ajouter les variables d’environnement (si nécessaires) :

```
VITE_API_URL=https://api.erols.cm
```

4️⃣ Déployer et obtenir l’URL publique.

---

## 👥 7. Règles pour les contributeurs

🔹 **Branches** :

* `feature/nom_fonction` pour les nouvelles fonctionnalités
* `bugfix/nom_bug` pour corriger un bug
* `hotfix/nom_fix` pour un correctif urgent

🔹 **Code** :

* Respecter **TypeScript strict**, **ESLint**, **Prettier**
* Ajouter des tests unitaires ou d’intégration si nécessaire
* Messages de commit clairs :

  * `feat(cart): add checkout page`
  * `fix(products): correct image loading bug`

---

## 🌟 8. Fonctionnalités principales (MVP)

* 🛍️ **Produits** : catalogue, recherche, filtres
* 🧑‍💻 **Utilisateurs** : inscription / connexion via JWT
* 🛒 **Commandes** : panier, commande, suivi
* 🚚 **Livraison** : points relais, suivi temps réel
* 🏪 **Marketplace** : création boutique, gestion produits
* 🔔 **Notifications** : email et notifications in-app

---

## 🙌 9. Contributeurs

Merci à tous ceux qui contribuent à l’évolution de **EROLS EasyBuy**. Chaque amélioration rapproche le Cameroun du marché chinois.

---

## 📞 Contact

* **Email :** [visiontech.ft@gmail.com](mailto:visiontech.ft@gmail.com)
* **Site web :** [www.erols.cm](http://www.erols.cm) (à venir)


