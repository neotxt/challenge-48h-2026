import { Post } from "./Post.js";

export class PostService {
    constructor(repository) {
        this.repository = repository;
    }

    createPost(content, authorId) {
        if (!content || content.length > 280) throw new Error("Contenu invalide");
        const post = new Post(null, authorId, content);
        return this.repository.save(post);
    }

    getAllPosts() {
        return this.repository.findAll();
    }
}