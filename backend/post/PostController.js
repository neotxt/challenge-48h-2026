import { PostService } from "./PostService.js";
import { PostRepository } from "./PostRepository.js";
import { AiService } from "../ai/AiService.js"; // Import manquant corrigé

const aiService = new AiService();

export class PostController {
    constructor() {
        this.postService = new PostService(new PostRepository());
    }

    async handleGetAll(req, res) {
        try {
            const posts = await this.postService.getAllPosts();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(posts));
        } catch (err) {
            console.error("Erreur lors de la récupération des posts :", err);
            res.writeHead(500);
            res.end(JSON.stringify([]));
        }
    }

    async handleCreate(req, res) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const content = data.content ?? data.contenu;
                const authorId = data.authorId ?? data.auteur;

                if (!content) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Le contenu du post est requis." }));
                }

                // Vérification toxicité
                const toxic = await aiService.isToxic(content);
                if (toxic) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Message inapproprié." }));
                }
                const newPost = await this.postService.createPost(content, authorId);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newPost));
            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    }
}