import { UserService } from "./UserService.js";

export class UserController {
    constructor() {
        this.userService = new UserService();
    }

    /**
     * Gère la récupération de tous les utilisateurs (GET /users).
     */
    handleGetAll(req, res) {
        const users = this.userService.getAll();
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(users));
    }

    /**
     * Gère la création d'un utilisateur (POST /users).
     */
    handleCreate(req, res) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const data = JSON.parse(body);
            const newUser = this.userService.create(data);
            res.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(newUser));
        });
    }

    /** Gère PUT /users/:id */
    handleUpdate(req, res, id) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const data = JSON.parse(body);
            const updatedUser = this.userService.updateUser(id, data);

            if (updatedUser) {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(updatedUser));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: "Utilisateur non trouvé" }));
            }
        });
    }

    /** Gère DELETE /users/:id */
    handleDelete(req, res, id) {
        const success = this.userService.deleteUser(id);
        res.writeHead(success ? 200 : 404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success }));
    }
}