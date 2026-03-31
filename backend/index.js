import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { UserController } from "./user/UserController.js";
import { PostController } from "./post/PostController.js";
import { AiService } from "./ai/AiService.js";


const userController = new UserController();
const postController = new PostController();
const aiService = new AiService();


const server = http.createServer((req, res) => {
    const urlParts = req.url.split('/');
    const extension = path.extname(req.url);

    // 1. GESTION DES FICHIERS STATIQUES (FRONTEND)
    // On sert les fichiers depuis le dossier racine ou /frontend selon leur emplacement
    if (req.url === '/' || req.url === '/index.html' || extension === '.css' || extension === '.js') {
        const fileName = (req.url === '/' || req.url === '/index.html') ? 'index.html' : req.url;

        // On cherche d'abord dans /frontend/ puis à la racine
        let filePath = path.join(process.cwd(), 'frontend', fileName);
        if (!fs.existsSync(filePath)) {
            filePath = path.join(process.cwd(), fileName);
        }

        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript'
        };

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Fichier statique non trouvé");
                return;
            }
            res.writeHead(200, { 'Content-Type': mimeTypes[extension] || 'text/html' });
            res.end(data);
        });
        return;
    }

    // 2. ROUTAGE API - UTILISATEURS (/users)
    if (urlParts[1] === 'users') {
        const id = urlParts[2];
        if (!id) {
            if (req.method === 'GET') return userController.handleGetAll(req, res);
            if (req.method === 'POST') return userController.handleCreate(req, res);
        } else {
            if (req.method === 'PUT') return userController.handleUpdate(req, res, id);
            if (req.method === 'DELETE') return userController.handleDelete(req, res, id);
        }
    }

    // 3. ROUTAGE API - POSTS (/posts)
    if (urlParts[1] === 'posts') {
        const id = urlParts[2];
        if (!id) {
            // Récupérer tous les posts ou en créer un
            if (req.method === 'GET') return postController.handleGetAll(req, res);
            if (req.method === 'POST') return postController.handleCreate(req, res);
        } else {
            // Modifier ou supprimer un post spécifique par son ID
            if (req.method === 'PUT') return postController.handleUpdate(req, res, id);
            if (req.method === 'DELETE') return postController.handleDelete(req, res, id);
        }
    }

    if (urlParts[1] === 'ai' && urlParts[2] === 'assist') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
                const data = JSON.parse(body);
                const texteAmeliore = await aiService.ameliorerTexte(data.texte);
                
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ resultat: texteAmeliore }));
            });
        }
}

    // 4. ERREUR 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Route non trouvée" }));
});

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

server.listen(PORT, () => {
    console.log(`✅ Serveur YFeeds lancé sur ${URL}`);

    // Ouvre automatiquement le navigateur
    const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
    exec(`${start} ${URL}`);
});