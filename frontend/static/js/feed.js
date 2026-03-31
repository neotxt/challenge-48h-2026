// ==========================================
// 0. VÉRIFICATION DE LA CONNEXION
// ==========================================
const userString = localStorage.getItem('currentUser');
if (!userString) {
  alert("Vous devez être connecté pour accéder au fil d'actualité.");
  window.location.href = 'login.html';
}

const currentUser = JSON.parse(userString);

// ==========================================
// INITIALISATION DE LA PAGE ET DES ÉLÉMENTS DOM
// ==========================================
const btnPublier = document.getElementById('bouton-publier');
const btnIa = document.getElementById('bouton-ia');
const champPost = document.getElementById('champ-post');
const conteneurPosts = document.getElementById('conteneur-posts');

// --- DYNAMISME DU PROFIL (NOUVEAU) ---
if (champPost) {
  champPost.placeholder = `Quoi de neuf, ${currentUser.name.split(' ')[0]} ?`;
}

const nomSidebar = document.getElementById('nom-utilisateur-sidebar');
if (nomSidebar) nomSidebar.textContent = currentUser.name;

// On récupère la première lettre du nom pour l'avatar
const initiale = currentUser.name.charAt(0).toUpperCase();

// On applique cette initiale à tous les avatars ronds de la page
const avatarHeader = document.getElementById('avatar-header');
const avatarSidebar = document.getElementById('avatar-sidebar');
const avatarComposer = document.getElementById('avatar-composer');

if (avatarHeader) avatarHeader.textContent = initiale;
if (avatarSidebar) avatarSidebar.textContent = initiale;
if (avatarComposer) avatarComposer.textContent = initiale;

// ==========================================
// 1. CHARGER LES POSTS
// ==========================================
async function chargerPosts() {
  try {
    const response = await fetch('/posts');
    const posts = await response.json();

    conteneurPosts.innerHTML = '';
    if (posts.length === 0) {
      conteneurPosts.innerHTML = '<p style="text-align:center; color:gray;">Aucun post pour le moment.</p>';
    } else {
      posts.forEach(post => ajouterPostAuDOM(post));
    }
  } catch (err) {
    console.error("Erreur de chargement des posts :", err);
  }
}

// ==========================================
// 2. AFFICHER UN POST DANS LE HTML
// ==========================================
function ajouterPostAuDOM(post) {
  const html = `
        <div class="post-carte" style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <strong style="color: #2c3e50; font-size: 1.1em;">${post.username || 'Anonyme'}</strong>
            <p style="margin-top: 8px; color: #333;">${post.content}</p>
        </div>
    `;
  conteneurPosts.insertAdjacentHTML('beforeend', html);
}

// ==========================================
// 3. PUBLIER UN POST AVEC LE VRAI AUTEUR
// ==========================================
if (btnPublier) {
  btnPublier.addEventListener('click', async () => {
    const contenuSaisi = champPost.value.trim();
    if (!contenuSaisi) return alert("Le message est vide !");

    btnPublier.disabled = true;
    btnPublier.textContent = "Vérification...";

    try {
      // ✅ NOUVELLE: Vérifier si le contenu est toxique
      const checkResponse = await fetch('/api/ai/check-toxic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: contenuSaisi })
      });
      const checkData = await checkResponse.json();

      if (checkData.isToxic) {
        alert("⚠️ Votre message contient du contenu inapproprié. Veuillez le réviser.");
        btnPublier.disabled = false;
        btnPublier.textContent = "Publier";
        return;
      }

      btnPublier.textContent = "Publication...";

      const response = await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ CORRECTION ICI : On utilise "content" et "authorId" pour matcher avec le Repository !
        body: JSON.stringify({ content: contenuSaisi, authorId: currentUser.id })
      });

      if (response.ok) {
        champPost.value = '';
        chargerPosts();
      } else {
        const data = await response.json();
        alert("Erreur : " + data.error);
      }
    } catch (err) {
      console.error("Erreur :", err);
      alert("Impossible de contacter le serveur.");
    } finally {
      btnPublier.disabled = false;
      btnPublier.textContent = "Publier";
    }
  });
}

// ==========================================
// 4. AMÉLIORER AVEC L'IA
// ==========================================
if (btnIa) {
  btnIa.addEventListener('click', async () => {
    const texteActuel = champPost.value.trim();
    if (!texteActuel) return alert("Écris un brouillon d'abord !");

    btnIa.textContent = "⏳...";
    btnIa.disabled = true;

    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: texteActuel })
      });
      const data = await response.json();

      if (data.improvedText) {
        champPost.value = data.improvedText;
      } else {
        alert("Erreur IA : " + (data.error || "Inconnue"));
      }
    } catch (err) {
      alert("L'IA est indisponible.");
    } finally {
      btnIa.textContent = "✨ Améliorer (IA)";
      btnIa.disabled = false;
    }
  });
}

// ==========================================
// 5. DÉCONNEXION
// ==========================================
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });
}

// ==========================================
// INITIALISATION FINALE
// ==========================================
document.addEventListener('DOMContentLoaded', chargerPosts);