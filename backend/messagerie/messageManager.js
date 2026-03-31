import db from '../database/db-config.js'; // Extension .js obligatoire
import Message from './message.js';

export class MessageManager {
    async envoyerMessage(senderId, receiverId, content) {
        const fromId = Number.parseInt(senderId, 10);
        const toId = Number.parseInt(receiverId, 10);
        const sql = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *`;
        const res = await db.query(sql, [fromId, toId, content]);
        return res.rows[0];
    }

    async recupererConversation(userA, userB) {
        const userAId = Number.parseInt(userA, 10);
        const userBId = Number.parseInt(userB, 10);
        const sql = `
            SELECT * FROM messages 
            WHERE (sender_id = $1 AND receiver_id = $2) 
            OR (sender_id = $2 AND receiver_id = $1) 
            ORDER BY sent_at ASC`;
        const res = await db.query(sql, [userAId, userBId]);
        return res.rows.map(row => new Message(row));
    }

    async recupererListeConversations(userId) {
        const currentUserId = Number.parseInt(userId, 10);
        // Utilisation de CASE WHEN (syntaxe Postgres) au lieu de IF
        const sql = `
            SELECT DISTINCT ON (contact_id) 
                CASE 
                    WHEN sender_id = $1 THEN receiver_id 
                    ELSE sender_id 
                END AS contact_id,
                sent_at
            FROM messages 
            WHERE sender_id = $1 OR receiver_id = $1
            ORDER BY contact_id, sent_at DESC`;

        const res = await db.query(sql, [currentUserId]);
        return res.rows;
    }

    async marquerCommeLu(messageId) {
        const id = Number.parseInt(messageId, 10);
        await db.query("UPDATE messages SET is_read = TRUE WHERE id = $1", [id]);
    }
}

const messageManager = new MessageManager();
export default messageManager;