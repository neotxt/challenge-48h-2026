export default class Message {
    constructor({ id, sender_id, receiver_id, content, sent_at, is_read = false }) {
        if (!sender_id || !receiver_id) {
            throw new Error('sender_id and receiver_id are required');
        }
        if (!content || typeof content !== 'string' || !content.trim()) {
            throw new Error('content must be a non-empty string');
        }

        this.id = id;
        this.senderId = sender_id;
        this.receiverId = receiver_id;
        this.content = content.trim();
        this.sentAt = sent_at ? new Date(sent_at) : new Date();
        this.isRead = is_read;
    }

    markAsRead() {
        this.isRead = true;
        return this;
    }

    isFromSender(userId) {
        return this.senderId === userId;
    }

    toJSON() {
        return {
            id: this.id,
            sender_id: this.senderId,
            receiver_id: this.receiverId,
            content: this.content,
            sent_at: this.sentAt.toISOString(),
            is_read: this.isRead,
        };
    }

    static fromJSON(data) {
        return new Message(data);
    }
}