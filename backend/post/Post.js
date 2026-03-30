// backend/post/Post.js
export class Post {
    constructor(id, auteur, contenu, date = new Date().toLocaleString()) {
        this.id = id;
        this.auteur = auteur; // Correspond au frontend
        this.contenu = contenu; // Correspond au frontend
        this.date = date;
        this.likes = 0;
    }
}