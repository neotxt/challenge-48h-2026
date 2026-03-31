import dbInstance from '../database/db-config.js';

export class PostRepository {
    tableReady = false;

    async ensureTable() {
        if (this.tableReady) return;

        const query = `
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                author_id INT REFERENCES users(id) ON DELETE SET NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `;

        await dbInstance.query(query);
        this.tableReady = true;
    }

    // Enregistre un nouveau post
    async save(post) {
        await this.ensureTable();
        const query = 'INSERT INTO posts (content, author_id, created_at) VALUES ($1, $2, NOW()) RETURNING *';
        // On s'assure que si authorId n'est pas envoyé, on ne fait pas planter la BDD
        const values = [post.content, post.authorId || null];
        const res = await dbInstance.query(query, values);
        return res.rows[0];
    }

    // Récupère tous les posts du plus récent au plus ancien
    async findAll() {
        try {
            await this.ensureTable();
            const query = `
                SELECT posts.*, users.username AS username 
                FROM posts 
                LEFT JOIN users ON posts.author_id = users.id 
                ORDER BY posts.created_at DESC
            `;
            const res = await dbInstance.query(query);
            return res.rows;
        } catch (err) {
            console.error("Erreur SQL findAll:", err);
            return [];
        }
    }
}