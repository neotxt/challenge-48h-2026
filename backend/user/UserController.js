import { UserService } from "./UserService.js";

export class UserController {
    constructor() {
        this.userService = new UserService();
    }

    /**
     * Gère la récupération de tous les utilisateurs (GET /users).
     */
    async handleGetAll(req, res) {
        const users = await this.userService.getAll();
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(users));
    }

    /**
     * Gère la création d'un utilisateur (POST /users).
     */
    async handleCreate(req, res) { // AJOUTE async ICI
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => { // AJOUTE async ICI AUSSI
            try {
                const data = JSON.parse(body);
                // AJOUTE await ICI
                const newUser = await this.userService.create(data);

                res.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(newUser));
            } catch (err) {
                console.error("Erreur détaillée :", err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    }

    /**
     * Gère la connexion (POST /api/login).
     */
    async handleLogin(req, res) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const user = await this.userService.login(data.email, data.password);

                // On retire le mot de passe avant de renvoyer l'utilisateur au frontend
                delete user.password;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Connexion réussie", user: user }));
            } catch (err) {
                // Erreur 401 = Non autorisé (Mauvais mdp ou email)
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    }



    /** Gère PUT /users/:id */
    async handleUpdate(req, res, id) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            const data = JSON.parse(body);
            const updatedUser = await this.userService.updateUser(id, data);

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
    async handleDelete(req, res, id) {
        const success = await this.userService.deleteUser(id);
        res.writeHead(success ? 200 : 404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success }));
    }
}