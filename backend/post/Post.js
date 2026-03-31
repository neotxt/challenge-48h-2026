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
    constructor(id, authorId, content, date = new Date().toISOString()) {
        this.id = id;
        this.authorId = authorId;
        this.content = content;
        this.date = date;
        this.likes = 0;
    }

    toPersistence() {
        return {
            author_id: this.authorId,
            content: this.content,
            created_at: this.date
        };
    }
}