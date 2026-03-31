const db = require('../database/db-config');
const Message = require('./message');

class MessageManager {
    async envoyerMessage(senderId, receiverId, content) {
        const sql = `
            INSERT INTO messages (sender_id, receiver_id, content) 
            VALUES ($1, $2, $3) RETURNING *`;
        const res = await db.query(sql, [senderId, receiverId, content]);
        return new Message(res.rows[0]);
    }

    async recupererConversation(userA, userB) {
        const sql = `
            SELECT * FROM messages 
            WHERE (sender_id = $1 AND receiver_id = $2) 
            OR (sender_id = $2 AND receiver_id = $1) 
            ORDER BY sent_at ASC`;
        const res = await db.query(sql, [userA, userB]);
        return res.rows.map(row => new Message(row));
    }

    async recupererListeConversations(userId) {
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
        
        const res = await db.query(sql, [userId]);
        return res.rows;
    }

    async marquerCommeLu(messageId) {
        await db.query("UPDATE messages SET is_read = TRUE WHERE id = $1", [messageId]);
    }
}

module.exports = new MessageManager();