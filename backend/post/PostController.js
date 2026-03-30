// backend/post/PostController.js
import { PostService } from "./PostService.js";
import { PostRepository } from "./PostRepository.js";

export class PostController {
    constructor() {
        // On instancie les dépendances ici pour correspondre à ton UserController
        this.postService = new PostService(new PostRepository());
    }

    handleGetAll(req, res) {
        const posts = this.postService.getAllPosts();
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(posts));
    }

    handleCreate(req, res) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const data = JSON.parse(body);
            // On ajoute "auteur" pour correspondre à ce qu'attend ton frontend
            const newPost = this.postService.createPost(data.contenu, data.auteur || "Anonyme");
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newPost));
        });
    }

    handleDelete(req, res, id) {
        // À ajouter dans ton PostService/Repository si tu veux la suppression
        res.writeHead(200); res.end(JSON.stringify({ success: true }));
    }
}