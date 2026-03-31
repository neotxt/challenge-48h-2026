import messageManager from './messageManager.js';

export class MessageController {
    async handleSend(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body || '{}');
                const senderId = data.senderId ?? data.sender_id;
                const receiverId = data.receiverId ?? data.receiver_id;
                const content = (data.content || '').trim();

                if (!senderId || !receiverId || !content) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'senderId, receiverId et content sont requis.' }));
                }

                const message = await messageManager.envoyerMessage(senderId, receiverId, content);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(message));
            } catch (err) {
                console.error('Erreur envoi message :', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Impossible d\'envoyer le message.' }));
            }
        });
    }

    async handleGetConversation(req, res, urlObj) {
        try {
            const userA = urlObj.searchParams.get('userA');
            const userB = urlObj.searchParams.get('userB');

            if (!userA || !userB) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'userA et userB sont requis.' }));
            }

            const conversation = await messageManager.recupererConversation(userA, userB);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(conversation));
        } catch (err) {
            console.error('Erreur récupération conversation :', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Impossible de charger la conversation.' }));
        }
    }

    async handleGetConversations(req, res, urlObj) {
        try {
            const userId = urlObj.searchParams.get('userId');

            if (!userId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'userId est requis.' }));
            }

            const conversations = await messageManager.recupererListeConversations(userId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(conversations));
        } catch (err) {
            console.error('Erreur récupération conversations :', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Impossible de charger les conversations.' }));
        }
    }

    async handleMarkAsRead(req, res, urlObj) {
        try {
            const messageId = urlObj.searchParams.get('messageId');

            if (!messageId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'messageId est requis.' }));
            }

            await messageManager.marquerCommeLu(messageId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (err) {
            console.error('Erreur marquage lu :', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Impossible de marquer le message comme lu.' }));
        }
    }
}
