/* ============================================================
   SCRIPT.JS — CampusNet
   
   3 classes :
     1. Post      → un post du fil d'actualité
     2. News      → une actualité Ynov
     3. AppFeed   → le chef d'orchestre de l'application
============================================================ */



/* ============================================================
   CLASSE 1 : Post
============================================================ */
class Post {

  constructor(auteur, contenu, date) {
    /* ID unique pour retrouver ce post plus tard */
    this.id       = Date.now() + Math.random();
    this.auteur   = auteur;
    this.contenu  = contenu;
    this.date     = date;

    /* Génère automatiquement les initiales : "Sarah M." → "SM" */
    this.initiales = this._genererInitiales(auteur);

    this.likes = 0;
    this.aime  = false;
  }

  _genererInitiales(nom) {
    return nom
      .split(" ")
      .map(mot => mot[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
}



/* ============================================================
   CLASSE 2 : News
============================================================ */
class News {

  constructor(titre, date, description, badge) {
    this.titre       = titre;
    this.date        = date;
    this.description = description;
    this.badge       = badge;
  }
}



/* ============================================================
   CLASSE 3 : AppFeed — l'application principale
============================================================ */
class AppFeed {

  constructor() {

    this.posts = [
      new Post(
        "Sarah M.",
        "Quelqu'un cherche un développeur front pour le challenge 48h ? Je suis dispo 🚀",
        "30/03/2026 • 14:20"
      ),
      new Post(
        "Lucas T.",
        "Je peux partager mes notes complètes de SQL à ceux qui en ont besoin. DM moi !",
        "30/03/2026 • 13:05"
      ),
      new Post(
        "Inès R.",
        "Super opportunité d'alternance en data science sur Ymatch ce matin !",
        "30/03/2026 • 10:42"
      )
    ];

    this.posts[0].likes = 14;
    this.posts[1].likes = 8;
    this.posts[2].likes = 22;

    this.newsList = [
      new News("Challenge 48h",   "31 mars 2026",  "Sprint intensif pour créer le réseau social du campus !", "🔥 Live"),
      new News("Forum Alternance","12 avril 2026", "Rencontres avec des recruteurs. Préparez vos CVs !",      "📅 Bientôt"),
      new News("Soirée BDE",      "5 avril 2026",  "Grande soirée de printemps. Entrée gratuite étudiants Ynov.", "🎉 BDE"),
      new News("Tournoi BDS",     "8 avril 2026",  "Tournoi inter-campus de basketball. Inscriptions avant le 3 avril.", "⚽ BDS")
    ];

    this.conteneurPosts = document.getElementById("conteneur-posts");
    this.conteneurNews  = document.getElementById("conteneur-news");
    this.champPost      = document.getElementById("champ-post");
    this.boutonPublier  = document.getElementById("bouton-publier");
    this.compteurPosts  = document.getElementById("compteur-posts");
    this.compteurFeed   = document.getElementById("compteur-feed");

    this.demarrer();
  }


  demarrer() {
    this.afficherPosts();
    this.afficherNews();
    this.ecouterEvenements();
    this.mettreAJourCompteurs();
  }


  ecouterEvenements() {
    this.boutonPublier.addEventListener("click", () => this.creerPost());

    this.champPost.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") this.creerPost();
    });
  }


  creerPost() {
    const texte = this.champPost.value.trim();

    if (texte === "") {
      this.boutonPublier.classList.add("bouton--secouer");
      setTimeout(() => this.boutonPublier.classList.remove("bouton--secouer"), 400);
      return;
    }

    const maintenant   = new Date();
    const dateFormatee =
      maintenant.toLocaleDateString("fr-FR") +
      " • " +
      maintenant.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const nouveauPost = new Post("Moi", texte, dateFormatee);
    this.posts.unshift(nouveauPost);

    this.champPost.value = "";
    this.afficherPosts();
    this.mettreAJourCompteurs();
  }


  /* ============================================================
     MÉTHODE : supprimerPost(idPost)
     
     Supprime un post du tableau en cherchant son ID.
     
     "filter" crée un NOUVEAU tableau sans l'élément qu'on veut supprimer.
     Exemple : [1, 2, 3].filter(x => x !== 2) → [1, 3]
     
     On affiche ensuite une confirmation avant de supprimer,
     pour éviter les suppressions accidentelles.
  ============================================================ */
  supprimerPost(idPost) {

    /* On demande confirmation à l'utilisateur */
    const confirmation = confirm("Veux-tu vraiment supprimer ce post ?");

    /* Si l'utilisateur clique "Annuler", on s'arrête */
    if (!confirmation) return;

    /* On garde tous les posts SAUF celui avec cet id */
    this.posts = this.posts.filter(post => post.id !== idPost);

    /* On réaffiche les posts et on met à jour les compteurs */
    this.afficherPosts();
    this.mettreAJourCompteurs();
  }


  basculerLike(idPost) {
    const post = this.posts.find(p => p.id === idPost);
    if (!post) return;

    post.aime  = !post.aime;
    post.likes = post.aime ? post.likes + 1 : post.likes - 1;

    this.afficherPosts();
  }


  mettreAJourCompteurs() {
    const total = this.posts.length;
    this.compteurPosts.textContent = total;
    this.compteurFeed.textContent  = total + " post" + (total > 1 ? "s" : "");
  }


  afficherPosts() {
    this.conteneurPosts.innerHTML = "";

    if (this.posts.length === 0) {
      this.conteneurPosts.innerHTML = `
        <div class="message-vide">
          Aucun post pour l'instant. Sois le premier à publier !
        </div>
      `;
      return;
    }

    this.posts.forEach(post => {
      const carte = document.createElement("article");
      carte.classList.add("post-carte");

      const classeLike = post.aime ? "bouton-like bouton-like--actif" : "bouton-like";

      /* On affiche le bouton supprimer SEULEMENT sur les posts de "Moi" */
      /* Les posts des autres utilisateurs ne peuvent pas être supprimés */
      const boutonSupprimerHtml = post.auteur === "Moi"
        ? `<button class="bouton-supprimer" onclick="app.supprimerPost(${post.id})" title="Supprimer ce post">
             🗑 Supprimer
           </button>`
        : "";

      carte.innerHTML = `
        <div class="post-carte__haut">
          <div class="post-avatar">${this.escapeHtml(post.initiales)}</div>
          <div class="post-meta">
            <span class="post-auteur">${this.escapeHtml(post.auteur)}</span>
            <span class="post-date">${this.escapeHtml(post.date)}</span>
          </div>
        </div>

        <div class="post-contenu">${this.escapeHtml(post.contenu)}</div>

        <div class="post-actions">
          <button class="${classeLike}" onclick="app.basculerLike(${post.id})">
            ♥ <span>${post.likes}</span>
          </button>
          <button class="bouton-repondre">💬 Répondre</button>

          <!-- Bouton supprimer affiché uniquement sur MES posts -->
          ${boutonSupprimerHtml}
        </div>
      `;

      this.conteneurPosts.appendChild(carte);
    });
  }


  afficherNews() {
    this.conteneurNews.innerHTML = "";

    this.newsList.forEach(news => {
      const carte = document.createElement("article");
      carte.classList.add("news-carte");

      const badgeHtml = news.badge
        ? `<span class="news-badge">${this.escapeHtml(news.badge)}</span>`
        : "";

      carte.innerHTML = `
        ${badgeHtml}
        <p class="news-titre">${this.escapeHtml(news.titre)}</p>
        <p class="news-date">📅 ${this.escapeHtml(news.date)}</p>
        <p class="news-description">${this.escapeHtml(news.description)}</p>
      `;

      this.conteneurNews.appendChild(carte);
    });
  }


  escapeHtml(texte) {
    const div = document.createElement("div");
    div.textContent = texte;
    return div.innerHTML;
  }
}


/* Lance l'application quand la page est prête */
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new AppFeed();
});
