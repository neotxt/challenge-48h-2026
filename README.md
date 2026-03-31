# 🎓 Ynov Community

Une plateforme sociale pour les étudiants Ynov - Fil d'actualité, messagerie, profil utilisateur et assistance IA intégrée.

## Groupe 10

Néo, Mayles, Lucas et Minna

## 🚀 Quick Start

### Prérequis
- **Node.js** 16+
- **PostgreSQL** (ynov_community database)
- **API Key Gemini** (optionnel, pour l'IA)

### Installation

```bash
# Cloner/Ouvrir le projet
cd challenge-48h-2026

# Installer les dépendances
npm install

# Créer un fichier .env avec:
GEMINI_API = "votre_clé_api"
DATABASE_URL = "postgresql://user:password@localhost:5432/ynov_community"

# Lancer le serveur
npm start
# ou: node backend/index.js
```

L'application démarre sur **http://localhost:3000**

---

## 📋 Fonctionnalités

### 👤 Authentification
- ✅ Inscription avec email/password (hachage bcrypt)
- ✅ Connexion sécurisée
- ✅ Session via localStorage

### 📝 Fil d'actualité (Feed)
- ✅ Publier des posts texte
- ✅ Voir tous les posts de la communauté
- ✅ Affichage avec auteur et date
- ✅ Compteur de posts par utilisateur

### ✨ Assistance IA
- ✅ **Amélioration de texte** : Rendre les posts plus professionnels
- ✅ **Modération intelligente** : Détection automatique de contenu inapproprié
- 🛡️ **Mots-clés locaux** : Insultes, haine, violence
- 🤖 **API Gemini** : Validation secondaire (si disponible)

### 💬 Messagerie
- ✅ Envoyer des messages privés
- ✅ Voir l'historique des conversations
- ✅ Marquer comme lu
- ✅ Liste des contacts

### 👨‍💼 Profil utilisateur
- ✅ Modifier les infos (nom, rôle, promo)
- ✅ Changer le mot de passe
- ✅ Avatar avec initiale du nom
- ✅ Modération du profil avant sauvegarde

---

## 🏗️ Architecture

```
challenge-48h-2026/
├── backend/
│   ├── index.js              # Serveur HTTP principal
│   ├── ai/
│   │   └── AiService.js      # Amélioration + Modération IA
│   ├── user/
│   │   ├── User.js
│   │   ├── UserController.js
│   │   ├── UserService.js
│   │   └── UserRepository.js
│   ├── post/
│   │   ├── Post.js
│   │   ├── PostController.js
│   │   ├── PostService.js
│   │   └── PostRepository.js
│   ├── messagerie/
│   │   ├── Message.js
│   │   ├── MessageController.js
│   │   ├── MessageManager.js
│   │   └── messageRepository.js
│   └── database/
│       ├── db-config.js      # Connexion PostgreSQL
│       ├── schema.sql
│       └── queries.sql
│
├── frontend/
│   ├── templates/
│   │   ├── index.html        # Page d'accueil
│   │   ├── login.html        # Connexion
│   │   ├── inscription.html  # Inscription
│   │   ├── feed.html         # Fil d'actualité (principal)
│   │   ├── messages.html     # Messagerie
│   │   └── edit-profil.html  # Profil utilisateur
│   └── static/
│       ├── css/
│       │   ├── style.css
│       │   ├── feed.css
│       │   ├── profile.css
│       │   ├── login.css
│       │   └── inscription.css
│       ├── js/
│       │   ├── main.js
│       │   ├── feed.js
│       │   ├── messages.js
│       │   ├── mdp.js
│       │   └── loader.js
│       └── assets/
│           └── img/
│               ├── logo.png
│               └── [Campus images]
│
├── package.json
├── .env
└── README.md
```

---

## 🔌 API Endpoints

### 🔐 Authentification
```
POST /api/login
Body: { email, password }
Response: { user: { id, name, email, role, promo } }
```

### 👥 Utilisateurs
```
GET /api/users                    # Lister tous les users
POST /api/users                   # Créer un user
PUT /api/users/:id               # Mettre à jour un user
DELETE /api/users/:id            # Supprimer un user
```

### 📄 Posts
```
GET /posts                        # Récupérer tous les posts
POST /posts                       # Créer un post
Body: { content, authorId }
```

### 💬 Messages
```
POST /api/messages                # Envoyer un message
Body: { senderId, recipientId, content }

GET /api/messages/conversation    # Récupérer conversation avec un user
?otherUserId=2

GET /api/messages/conversations   # Lister toutes les conversations

PUT /api/messages/read            # Marquer comme lu
?messageId=5
```

### 🤖 IA
```
POST /api/ai/improve              # Améliorer un texte
Body: { text }
Response: { improvedText }

POST /api/ai/check-toxic          # Vérifier modération
Body: { text }
Response: { isToxic: boolean }
```

---

## 🎨 Design System - Ynov Community

### Couleurs
- **Verde principal** : `#2ecc71`
- **Verde foncé** : `#249d59`
- **Texte** : `#111827`
- **Bordures** : `#e5e7eb`
- **Background** : Gradient `#f9fcfa` → `#f3f9f6`

### Typographie
- **Font** : Inter (Google Fonts)
- **Weights** : 300-900

### Composants
- Glass-morphism headers avec `backdrop-filter: blur(8px)`
- Cartes blanches avec ombres douces
- Avatars circulaires avec initiale du nom
- Layout responsive (3 colonnes sur desktop, 1 sur mobile)

---

## 🛡️ Modération IA

### Détection locale (rapide)
Mots-clés bloqués :
- Insultes : `con`, `débile`, `connard`, `salaud`
- Haine : `raciste`, `sexiste`, `haine`
- Violence : `tuer`, `mort`, `suicide`

### Détection IA (Gemini)
- Seconde couche de validation si les mots-clés ne détectent rien
- Analyse contextuelle
- Fallback gracieux si API indisponible

### Points de contrôle
✅ Publication de posts → Validation avant envoi  
✅ Mise à jour profil → Validation du nom/rôle  

---

## 🔄 Flux d'utilisation

### 1️⃣ Inscription/Connexion
```
index.html → inscription.html → login.html → feed.html
```

### 2️⃣ Publication d'un post
```
Saisie texte
    ↓
Click "✨ Améliorer" (optionnel) → /api/ai/improve
    ↓
Click "Publier"
    ↓
/api/ai/check-toxic (validation)
    ↓
POST /posts (si OK)
    ↓
Rafraîchissement du feed
```

### 3️⃣ Messagerie
```
feed.html → messages.html
    ↓
Sélectionner contact
    ↓
GET /api/messages/conversation
    ↓
Afficher chat
    ↓
POST /api/messages (envoyer)
```

### 4️⃣ Profil
```
feed.html → edit-profil.html
    ↓
Modifier champs
    ↓
/api/ai/check-toxic (validation)
    ↓
PUT /api/users/:id (si OK)
    ↓
Redirection feed.html
```

---

## 🗄️ Base de données

### Tables
- **users** : id, username, email, password (hash), role, promo
- **posts** : id, content, author_id, created_at
- **messages** : id, sender_id, recipient_id, content, is_read, created_at
- **campuses** : id, name, city

### Migrations
La table `posts` est **auto-créée** lors du premier POST si elle n'existe pas (voir PostRepository.ensureTable()).

---

## ⚙️ Technologies

### Backend
- **Node.js** 16+ (HTTP natif, sans Express)
- **PostgreSQL** (pg library)
- **bcrypt** (hachage passwords)
- **Google Generative AI** (IA Gemini)
- **dotenv** (variables d'env)

### Frontend
- **HTML5** / **CSS3** / **JavaScript ES6+** (Modules ESM)
- **Google Fonts** (Inter)
- **Fetch API** (requêtes)
- **localStorage** (persistence sessions)

---

## 🐛 Debugging

### Problèmes courants

**Port 3000 déjà utilisé**
```powershell
$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($conn) { Stop-Process -Id $conn.OwningProcess -Force }
```

**API IA ne répond pas**
- Vérifier `process.env.GEMINI_API` dans `.env`
- L'app utilise un fallback (retourne le texte original)
- La modération locale continue à fonctionner

**Posts ne s'affichent pas**
- Vérifier que la table `posts` existe : `\dt posts` (psql)
- PostRepository auto-crée la table au premier POST
- Vérifier authorId = currentUser.id

**Profil ne se met à jour**
- Vérifier que `currentUser` est en localStorage après login
- Tester PUT `/api/users/1` avec curl/Postman
- Vérifier les champs : name, email, role, password (optionnel)

---

## 📝 Variables d'environnement (.env)

```env
GEMINI_API = "AIzaSy..."              # API Key Google Generative AI
DATABASE_URL = "postgresql://..."     # Connexion PostgreSQL
NODE_ENV = "development"              # Mode développement/production
```

---

## 📅 Roadmap

- [ ] Avatar upload (images)
- [ ] Like/favorite posts
- [ ] Notifications push
- [ ] Dark mode
- [ ] Recherche users/posts
- [ ] Filtres timeline (hashtags, campuses)
- [ ] Modération admin panel
- [ ] Analytics/Statistiques
- [ ] Export profil

---

## 👥 Auteur

Développé pour le Challenge 48h Ynov - 2026

---

## 📄 Licence

Privée - Ynov Campus

---

## 🤝 Support

Pour les bugs ou questions : Vérifier les logs serveur en console et les erreurs réseau dans DevTools (F12).
