import http from 'node:http';
import { UserController } from "./user/UserController.js";

const userController = new UserController();

const server = http.createServer((req, res) => {
    if (req.url === '/users' && req.method === 'GET') {
        userController.handleGetAll(req, res);
    } else if (req.url === '/users' && req.method === 'POST') {
        userController.handleCreate(req, res);
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route non trouvée" }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Serveur User lancé sur http://localhost:${PORT}`);
});