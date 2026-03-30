export class PostRepository {
    constructor() {
        this.posts = []; // Stockage permanent (ou DB)
    }

    save(post) {
        post.id = Date.now();
        this.posts.unshift(post);
        return post;
    }

    findAll() {
        return this.posts;
    }
}