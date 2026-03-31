import dbInstance from '../database/db-config.js';

/**
 * Gère l'accès aux données via PostgreSQL (Persistence).
 */
export class UserRepository {

    /**
     * Enregistre un nouvel utilisateur dans la base de données.
     * @param {Object} user 
     */
    async save(user) {
        console.log("Tentative d'enregistrement de :", user);
        const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [user.name, user.email, user.password, user.role];

        try {
            const res = await dbInstance.query(query, values);
            return res.rows[0]; // Retourne l'utilisateur inséré avec son ID
        } catch (err) {
            console.error("Erreur lors du save :", err);
            throw err;
        }
    }

    /**
     * Récupère tous les utilisateurs.
     */
    async findAll() {
        try {
            const res = await dbInstance.query('SELECT id, username as name, email, role, promo FROM users ORDER BY id ASC');
            return res.rows;
        } catch (err) {
            console.error("Erreur lors du findAll :", err);
            return [];
        }
    }

    /**
     * Trouve un utilisateur par son ID.
     */
    async findById(id) {
        try {
            const res = await dbInstance.query('SELECT id, username as name, email, role, promo FROM users WHERE id = $1', [Number.parseInt(id)]);
            return res.rows[0];
        } catch (err) {
            console.error("Erreur lors du findById :", err);
            return null;
        }
    }

    /**
     * Supprime un utilisateur par son ID.
     */
    async delete(id) {
        try {
            const res = await dbInstance.query('DELETE FROM users WHERE id = $1', [Number.parseInt(id)]);
            return res.rowCount > 0; // Retourne true si une ligne a été supprimée
        } catch (err) {
            console.error("Erreur lors du delete :", err);
            return false;
        }
    }

    /**
     * Met à jour un utilisateur dans la DB.
     */
    async update(id, data) {
        const query = `
            UPDATE users 
            SET username = COALESCE($1, username), 
                email = COALESCE($2, email), 
                role = COALESCE($3, role),
                password = COALESCE($4, password)
            WHERE id = $5 
            RETURNING id, username as name, email, role, promo`;
        const values = [data.name, data.email, data.role, data.hashedPassword || null, Number.parseInt(id)];

        try {
            const res = await dbInstance.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error("Erreur lors de l'update :", err);
            return null;
        }
    }

    async findByEmail(email) {
        try {
            const query = 'SELECT id, username AS name, email, password, role, promo FROM users WHERE email = $1';
            const res = await dbInstance.query(query, [email]);
            return res.rows[0]; // Renvoie l'utilisateur s'il existe, sinon undefined
        } catch (err) {
            console.error("Erreur findByEmail :", err);
            return null;
        }
    }
}