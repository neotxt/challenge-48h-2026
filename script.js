/* Classe Post */
class Post {
  constructor(auteur, contenu, date, tags = []) {
    this.id = Date.now() + Math.random();
    this.auteur = auteur;
    this.contenu = contenu;
    this.date = date;
    this.tags = tags;
    this.reponses = [];
    this.likes = 0;
    this.aime = false;
  }
}

/* Classe News */
class News {
  constructor(titre, date, description, badge = "") {
    this.titre = titre;
    this.date = date;
    this.description = description;
    this.badge = badge;
  }
}

/*Application principale*/
class AppFeed {
  constructor() {
    this.posts = [
      new Post(
        "Sarah M.",
        "Quelqu’un cherche un développeur front pour le challenge 48h ? Je suis dispo 🚀",
        "30/03/2026 • 14:20",
        ["Projet", "Dev"]
      ),
      new Post(
        "Lucas T.",
        "Je peux partager mes notes de SQL à ceux qui en ont besoin. DM moi !",
        "30/03/2026 • 13:05",
        ["Entraide", "SQL"]
      ),
      new Post(
        "Inès R.",
        "Super opportunité d'alternance en data science repérée ce matin !",
        "30/03/2026 • 10:42",
        ["Alternance", "Data"]
      )
    ];

    this.posts[0].likes = 14;
    this.posts[1].likes = 8;
    this.posts[2].likes = 22;

    this.news = [
      new News(
        "Challenge 48h",
        "31 mars 2026",
        "Sprint intensif pour créer le réseau social du campus.",
        "🔥 Live"
      ),
      new News(
        "Forum Alternance",
        "12 avril 2026",
        "Rencontres avec des recruteurs. Préparez vos CV !",
        "📅 Bientôt"
      ),
      new News(
        "Soirée BDE",
        "5 avril 2026",
        "Grande soirée de printemps. Entrée gratuite pour les étudiants.",
        "🎉 BDE"
      ),
      new News(
        "Tournoi BDS",
        "8 avril 2026",
        "Tournoi inter-campus. Inscriptions avant le 3 avril.",
        "⚽ BDS"
      )
    ];

    this.zonePosts = document.getElementById("conteneur-posts");
    this.zoneNews = document.getElementById("conteneur-news");
    this.inputPost = document.getElementById("champ-post");
    this.btnPublier = document.getElementById("bouton-publier");
    this.compteurPosts = document.getElementById("compteur-posts");
    this.compteurFeed = document.getElementById("compteur-feed");
    this.btnHeader = document.querySelector(".bouton-header");

    this.demarrer();
  }

  /* Lancement*/
  demarrer() {
    this.afficherPosts();
    this.afficherNews();
    this.mettreAJourCompteurs();

    this.btnPublier.addEventListener("click", () => this.creerPost());

    this.inputPost.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        this.creerPost();
      }
    });

    if (this.btnHeader) {
      this.btnHeader.addEventListener("click", () => this.inputPost.focus());
    }
  }

  /*Création d’un post*/
  creerPost() {
    const texte = this.inputPost.value.trim();

    if (!texte) {
      this.btnPublier.classList.add("bouton--secouer");
      setTimeout(() => {
        this.btnPublier.classList.remove("bouton--secouer");
      }, 400);
      return;
    }

    const maintenant = new Date();
    const date =
      maintenant.toLocaleDateString("fr-FR") +
      " • " +
      maintenant.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      });

    const tags = this.trouverTags(texte);
    const nouveauPost = new Post("Moi", texte, date, tags);

    this.posts.unshift(nouveauPost);
    this.inputPost.value = "";

    this.mettreAJour();
  }

  /*Trouver des tags simples*/
  trouverTags(texte) {
    const t = texte.toLowerCase();
    const tags = [];

    if (t.includes("alternance") || t.includes("stage")) tags.push("Alternance");
    if (t.includes("projet") || t.includes("challenge") || t.includes("groupe")) tags.push("Projet");
    if (t.includes("aide") || t.includes("entraide") || t.includes("partage")) tags.push("Entraide");
    if (t.includes("sql")) tags.push("SQL");
    if (t.includes("data")) tags.push("Data");
    if (t.includes("dev") || t.includes("front") || t.includes("back")) tags.push("Dev");

    return tags.length ? tags : ["Général"];
  }

  /*Like */
  basculerLike(id) {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return;

    post.aime = !post.aime;
    post.likes = post.aime ? post.likes + 1 : post.likes - 1;

    this.afficherPosts();
  }

  /* Réponse*/
  ajouterReponse(id) {
    const texte = prompt("Écris ta réponse :");
    if (!texte || !texte.trim()) return;

    const post = this.posts.find((p) => p.id === id);
    if (!post) return;

    post.reponses.push({
      auteur: "Moi",
      contenu: texte.trim()
    });

    this.afficherPosts();
  }

  /*  Mise à jour générale*/
  mettreAJour() {
    this.afficherPosts();
    this.mettreAJourCompteurs();
  }

  mettreAJourCompteurs() {
    const total = this.posts.length;
    this.compteurPosts.textContent = total;
    this.compteurFeed.textContent = total > 1 ? `${total} posts` : `${total} post`;
  }

  /*Affichage des posts*/
  afficherPosts() {
    this.zonePosts.innerHTML = "";

    if (this.posts.length === 0) {
      this.zonePosts.innerHTML = `
        <div class="message-vide">
          Aucun post pour l’instant. Sois le premier à publier !
        </div>
      `;
      return;
    }

    this.posts.forEach((post) => {
      const carte = document.createElement("article");
      carte.className = "post-carte";

      carte.innerHTML = `
        <div class="post-carte__haut">
          <div class="post-avatar">${this.initiales(post.auteur)}</div>

          <div class="post-meta">
            <span class="post-auteur">${this.securiser(post.auteur)}</span>
            <span class="post-date">${this.securiser(post.date)}</span>
          </div>
        </div>

        <div class="post-contenu">${this.securiser(post.contenu)}</div>

        <div class="post-tags">
          ${post.tags.map((tag) => `<span class="tag-post">#${this.securiser(tag)}</span>`).join("")}
        </div>

        <div class="post-actions">
          <button class="${post.aime ? "bouton-like bouton-like--actif" : "bouton-like"}" data-like="${post.id}">
            ♥ <span>${post.likes}</span>
          </button>

          <button class="bouton-repondre" data-reponse="${post.id}">
            💬 Répondre (${post.reponses.length})
          </button>
        </div>

        <div class="post-reponses">
          ${post.reponses.map((r) => `
            <div class="reponse-item">
              <span class="reponse-auteur">${this.securiser(r.auteur)}</span>
              <span class="reponse-contenu">${this.securiser(r.contenu)}</span>
            </div>
          `).join("")}
        </div>
      `;

      carte.querySelector("[data-like]").addEventListener("click", () => {
        this.basculerLike(post.id);
      });

      carte.querySelector("[data-reponse]").addEventListener("click", () => {
        this.ajouterReponse(post.id);
      });

      this.zonePosts.appendChild(carte);
    });
  }

  /*Affichage des news */
  afficherNews() {
    this.zoneNews.innerHTML = "";

    this.news.forEach((news) => {
      const carte = document.createElement("article");
      carte.className = "news-carte";

      carte.innerHTML = `
        ${news.badge ? `<span class="news-badge">${this.securiser(news.badge)}</span>` : ""}
        <p class="news-titre">${this.securiser(news.titre)}</p>
        <p class="news-date">📅 ${this.securiser(news.date)}</p>
        <p class="news-description">${this.securiser(news.description)}</p>
      `;

      this.zoneNews.appendChild(carte);
    });
  }

  /* Outils */
  initiales(nom) {
    return nom
      .split(" ")
      .map((mot) => mot[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  securiser(texte) {
    const div = document.createElement("div");
    div.textContent = texte;
    return div.innerHTML;
  }
}

/*  Lancement*/
document.addEventListener("DOMContentLoaded", () => {
  new AppFeed();
});