// backend/post/PostController.js
import { PostService } from "./PostService.js";
import { PostRepository } from "./PostRepository.js";

export class PostController {
    constructor() {
        // On instancie les dépendances ici pour correspondre à ton UserController
        this.postService = new PostService(new PostRepository());
    }

    async handleGetAll(req, res) {
        const posts = await this.postService.getAllPosts();
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(posts));
    }

    async handleCreate(req, res) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            const data = JSON.parse(body);
            const estToxique = await aiService.isToxic(data.contenu);
                if (estToxique) {
                    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.end(JSON.stringify({ error: "Votre message ne respecte pas les règles de la communauté." }));
                    return; // On arrête tout, le post n'est pas créé
                }
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