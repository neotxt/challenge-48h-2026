/**
 * 
 */
export class Post {
    /**
     * 
     * @param {*} id 
     * @param {*} auteur 
     * @param {*} contenu 
     * @param {*} date 
     */
    constructor(id, auteur, contenu, date = new Date().toLocaleString()) {
        this.id = id;
        this.auteur = auteur;
        this.contenu = contenu;
        this.date = date;
        this.likes = 0;
    }
}