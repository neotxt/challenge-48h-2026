import db from '../../database/db-config.js';

export class PostRepository {
    async save(post) {
        const query = 'INSERT INTO posts (auteur, contenu) VALUES ($1, $2) RETURNING *';
        const res = await db.query(query, [post.auteur, post.contenu]);
        return res.rows[0];
    }

    async findAll() {
        const res = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
        return res.rows;
    }
}