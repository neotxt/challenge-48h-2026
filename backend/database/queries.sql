SELECT * FROM messages 
WHERE (sender_id = 1 AND receiver_id = 2) OR (sender_id = 2 AND receiver_id = 1)
ORDER BY sent_at DESC LIMIT 10;

SELECT username, promo FROM users ORDER BY promo ASC;

INSERT INTO messages (sender_id, receiver_id, content) VALUES (1, 2, 'Prêt pour le pitch ?');