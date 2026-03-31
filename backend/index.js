import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { UserController } from "./user/UserController.js";
import { PostController } from "./post/PostController.js";
import { MessageController } from "./messagerie/MessageController.js";
import { AiService } from "./ai/AiService.js";

// --- ASTUCE MAGIQUE POUR LES CHEMINS ---
// __dirname pointera TOUJOURS sur le dossier "backend", de manière absolue.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userController = new UserController();
const postController = new PostController();
const messageController = new MessageController();
const aiService = new AiService();

const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, 'http://localhost:3000');
    const pathname = requestUrl.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- GESTION DES FICHIERS STATIQUES (CSS, JS, IMAGES) ---
    if (pathname.startsWith('/static/') || pathname.startsWith('/js/')) {
        // ✅ On part de "backend", on remonte ("..") et on va dans "frontend"
        const filePath = path.join(__dirname, '..', 'frontend', pathname);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Fichier statique non trouvé");
                return;
            }
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.svg': 'image/svg+xml'
            };
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
            res.end(data);
        });
        return;
    }

    // --- API : AMÉLIORATION IA ---
    if (pathname === '/api/ai/improve' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { text } = JSON.parse(body);
                const improved = await aiService.ameliorerTexte(text);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ improvedText: improved }));
            } catch (err) {
                console.error('Erreur IA :', err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: "Erreur IA" }));
            }
        });
        return;
    }

    // --- API : VÉRIFICATION MODÉRATION (CONTENU TOXIQUE) ---
    if (pathname === '/api/ai/check-toxic' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { text } = JSON.parse(body);
                const isToxic = await aiService.isToxic(text);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ isToxic, text }));
            } catch (err) {
                console.error('Erreur modération :', err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: "Erreur modération" }));
            }
        });
        return;
    }

    // --- API : GESTION DES USERS ---
    if (pathname === '/users' || pathname === '/api/users') {
        if (req.method === 'GET') return userController.handleGetAll(req, res);
        if (req.method === 'POST') return userController.handleCreate(req, res);
    }

    // --- API : MISE À JOUR D'UN UTILISATEUR ---
    const userIdMatch = pathname.match(/^\/api\/users\/(\d+)$/);
    if (userIdMatch && req.method === 'PUT') {
        const userId = userIdMatch[1];
        return userController.handleUpdate(req, res, userId);
    }

    // --- API : GESTION DES POSTS ---
    if (pathname === '/posts' || pathname === '/api/posts') {
        if (req.method === 'GET') return postController.handleGetAll(req, res);
        if (req.method === 'POST') return postController.handleCreate(req, res);
    }

    // --- API : GESTION DE LA MESSAGERIE ---
    if (pathname === '/api/messages' && req.method === 'POST') {
        return messageController.handleSend(req, res);
    }

    if (pathname === '/api/messages/conversation' && req.method === 'GET') {
        return messageController.handleGetConversation(req, res, requestUrl);
    }

    if (pathname === '/api/messages/conversations' && req.method === 'GET') {
        return messageController.handleGetConversations(req, res, requestUrl);
    }

    if (pathname === '/api/messages/read' && req.method === 'PUT') {
        return messageController.handleMarkAsRead(req, res, requestUrl);
    }

    // --- CHARGEMENT DES PAGES HTML ---
    const templates = ['/', '/index.html', '/login.html', '/inscription.html', '/feed.html', '/edit-profil.html', '/messages.html'];
    if (templates.includes(pathname)) {
        let fileName = (pathname === '/' || pathname === '/index.html') ? 'index.html' : pathname;
        if (fileName.startsWith('/')) fileName = fileName.substring(1);

        // ✅ On part de "backend", on remonte ("..") et on va dans "frontend/templates"
        const filePath = path.join(__dirname, '..', 'frontend', 'templates', fileName);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Page HTML non trouvée");
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    if (pathname === '/api/login' && req.method === 'POST') {
        return userController.handleLogin(req, res);
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route non trouvée : " + pathname }));
});

server.listen(3000, () => console.log("🚀 Serveur lancé sur http://localhost:3000"));