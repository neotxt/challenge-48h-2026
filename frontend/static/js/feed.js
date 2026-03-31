/**
 * Application Frontend : AppFeed
 * Gère l'interaction avec l'API Node.js et l'affichage dynamique.
 */
class AppFeed {
  constructor() {
    // On commence avec des tableaux vides, les données viendront du serveur
    this.posts = [];
    this.news = [];

    // Sélecteurs DOM (inchangés)
    this.zonePosts = document.getElementById("conteneur-posts");
    this.zoneNews = document.getElementById("conteneur-news");
    this.inputPost = document.getElementById("champ-post");
    this.btnPublier = document.getElementById("bouton-publier");
    this.compteurPosts = document.getElementById("compteur-posts");
    this.compteurFeed = document.getElementById("compteur-feed");
    this.btnHeader = document.querySelector(".bouton-header");

    this.API_URL = 'http://localhost:3000'; // Ton serveur Node.js

    this.demarrer();
  }

  /**
   * Initialise l'application au chargement
   */
  async demarrer() {
    await this.chargerDonnees();
    this.afficherNews(); // Les news peuvent rester en dur ou venir d'une autre route

    // Écouteurs d'événements
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

  /**
   * Récupère les données depuis le Back-end
   */
  async chargerDonnees() {
    try {
      // Appel vers ton PostController (route GET /posts)
      const res = await fetch(`${this.API_URL}/posts`);
      this.posts = await res.json();

      this.mettreAJour();
    } catch (error) {
      console.error("Erreur lors du chargement des posts :", error);
      this.zonePosts.innerHTML = `<div class="message-vide">Erreur de connexion au serveur.</div>`;
    }
  }

  /**
   * Envoie un nouveau post au Back-end
   */
  async creerPost() {
    const texte = this.inputPost.value.trim();

    if (!texte) {
      this.btnPublier.classList.add("bouton--secouer");
      setTimeout(() => this.btnPublier.classList.remove("bouton--secouer"), 400);
      return;
    }

    const tags = this.trouverTags(texte);

    try {
      // Appel vers ton PostController (route POST /posts)
      await fetch(`${this.API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auteur: "Moi", // Idéalement récupéré via une session
          contenu: texte,
          tags: tags
        })
      });

      this.inputPost.value = "";
      await this.chargerDonnees(); // On rafraîchit la liste
    } catch (error) {
      alert("Impossible de publier le message.");
    }
  }

  /**
   * Supprime un post (Appelle ton DELETE /posts/:id)
   */
  async supprimerPost(id) {
    if (!confirm("Supprimer ce post ?")) return;

    try {
      await fetch(`${this.API_URL}/posts/${id}`, { method: 'DELETE' });
      await this.chargerDonnees();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  }

  /**
   * Modifie un post (Appelle ton PUT /posts/:id)
   */
  async modifierPost(id) {
    const nouveauTexte = prompt("Modifie ton message :");
    if (!nouveauTexte) return;

    try {
      await fetch(`${this.API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenu: nouveauTexte })
      });
      await this.chargerDonnees();
    } catch (error) {
      console.error("Erreur modification :", error);
    }
  }

  /* --- Fonctions Utilitaires et Affichage (Gardées du travail de ta collègue) --- */

  trouverTags(texte) {
    const t = texte.toLowerCase();
    const tags = [];
    if (t.includes("alternance")) tags.push("Alternance");
    if (t.includes("projet")) tags.push("Projet");
    if (t.includes("dev")) tags.push("Dev");
    return tags.length ? tags : ["Général"];
  }

  mettreAJour() {
    this.afficherPosts();
    this.mettreAJourCompteurs();
  }

  mettreAJourCompteurs() {
    const total = this.posts.length;
    if (this.compteurPosts) this.compteurPosts.textContent = total;
    if (this.compteurFeed) this.compteurFeed.textContent = total > 1 ? `${total} posts` : `${total} post`;
  }

  afficherPosts() {
    this.zonePosts.innerHTML = "";

    if (this.posts.length === 0) {
      this.zonePosts.innerHTML = `<div class="message-vide">Aucun post pour l’instant.</div>`;
      return;
    }

    this.posts.forEach((post) => {
      const carte = document.createElement("article");
      carte.className = "post-carte";

      // On ajoute des boutons de gestion (Modifier/Supprimer)
      carte.innerHTML = `
        <div class="post-carte__haut">
          <div class="post-avatar">${this.initiales(post.auteur || "Anonyme")}</div>
          <div class="post-meta">
            <span class="post-auteur">${this.securiser(post.auteur || "Anonyme")}</span>
            <span class="post-date">${post.date}</span>
          </div>
          <div style="margin-left: auto;">
             <button onclick="app.modifierPost(${post.id})" style="background:none; border:none; cursor:pointer;">✏️</button>
             <button onclick="app.supprimerPost(${post.id})" style="background:none; border:none; cursor:pointer;">🗑️</button>
          </div>
        </div>
        <div class="post-contenu">${this.securiser(post.content || post.contenu)}</div>
        <div class="post-actions">
          <button class="bouton-like">♥ <span>${post.likes || 0}</span></button>
          <button class="bouton-repondre">💬 Répondre</button>
        </div>
      `;
      this.zonePosts.appendChild(carte);
    });
  }

  afficherNews() {
    // Données News (Peuvent rester en dur pour le challenge)
    const staticNews = [
      { titre: "Challenge 48h", date: "31 mars", description: "Sprint intensif en cours !", badge: "🔥 Live" }
    ];
    this.zoneNews.innerHTML = staticNews.map(n => `
      <article class="news-carte">
        ${n.badge ? `<span class="news-badge">${n.badge}</span>` : ""}
        <p class="news-titre">${n.titre}</p>
        <p class="news-date">📅 ${n.date}</p>
        <p class="news-description">${n.description}</p>
      </article>
    `).join("");
  }

  initiales(nom) {
    return nom.split(" ").map(m => m[0]).join("").toUpperCase().slice(0, 2);
  }

  securiser(texte) {
    const div = document.createElement("div");
    div.textContent = texte;
    return div.innerHTML;
  }
}

// Lancement de l'application
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new AppFeed();
});