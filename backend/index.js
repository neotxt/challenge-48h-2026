import http from 'node:http';
import fs from 'node:fs';
import { exec } from 'node:child_process';
import { UserController } from "./user/UserController.js";

const userController = new UserController();

const server = http.createServer((req, res) => {
    // Analyse de l'URL pour gérer les IDs (ex: /users/1)
    const urlParts = req.url.split('/');
    const isUserRouteWithId = urlParts[1] === 'users' && urlParts[2];

    // 1. Servir le Frontend
    if (req.url === '/' || req.url === '/index.html') {
        // Correction du chemin : ton fichier est dans le dossier /frontend/
        fs.readFile('./frontend/index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Erreur : Impossible de trouver frontend/index.html");
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // 2. Routes API pour tous les utilisateurs
    else if (req.url === '/users') {
        if (req.method === 'GET') {
            userController.handleGetAll(req, res);
        } else if (req.method === 'POST') {
            userController.handleCreate(req, res);
        }
    }
    // 3. Routes API dynamiques (/users/:id)
    else if (isUserRouteWithId) {
        const id = urlParts[2];
        if (req.method === 'PUT') {
            userController.handleUpdate(req, res, id);
        } else if (req.method === 'DELETE') {
            userController.handleDelete(req, res, id);
        }
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route non trouvée" }));
    }
});

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

server.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur ${URL}`);

    // Lancement automatique du navigateur
    const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
    exec(`${start} ${URL}`);
});