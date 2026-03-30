class Message {
    constructor({ id, sender_id, receiver_id, content, sent_at, is_read }) {
        this.id = id;
        this.senderId = sender_id;
        this.receiverId = receiver_id;
        this.content = content;
        this.sentAt = sent_at;
        this.isRead = is_read;
    }
}

module.exports = Message;