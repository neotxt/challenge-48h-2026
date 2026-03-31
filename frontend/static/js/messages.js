const currentUserRaw = localStorage.getItem('currentUser');

if (!currentUserRaw) {
    globalThis.location.href = 'login.html';
}

const currentUser = JSON.parse(currentUserRaw);
const usersEndpoint = '/users';
const messagesEndpoint = '/api/messages';

const contactsList = document.getElementById('contacts-list');
const chatTitle = document.getElementById('chat-title');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const avatarHeader = document.getElementById('avatar-header');
const backBtn = document.getElementById('btn-back');

let selectedContact = null;
let contacts = [];

if (avatarHeader) {
    avatarHeader.textContent = (currentUser.name || '?').charAt(0).toUpperCase();
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        globalThis.location.href = 'feed.html';
    });
}

async function loadContacts() {
    const response = await fetch(usersEndpoint);
    const users = await response.json();
    contacts = users.filter(user => Number(user.id) !== Number(currentUser.id));

    if (contacts.length === 0) {
        contactsList.innerHTML = '<p class="empty">Aucun contact disponible.</p>';
        return;
    }

    contactsList.innerHTML = '';

    contacts.forEach(user => {
        const btn = document.createElement('button');
        btn.className = 'contact-item';
        btn.textContent = user.name || user.email;
        btn.addEventListener('click', () => selectContact(user));
        contactsList.appendChild(btn);
    });
}

function highlightSelectedContact() {
    const items = contactsList.querySelectorAll('.contact-item');
    items.forEach(item => {
        item.classList.toggle('active', item.textContent === (selectedContact?.name || selectedContact?.email));
    });
}

async function selectContact(contact) {
    selectedContact = contact;
    chatTitle.textContent = `Conversation avec ${contact.name || contact.email}`;
    highlightSelectedContact();
    await loadConversation();
}

async function loadConversation() {
    if (!selectedContact) return;

    const url = `/api/messages/conversation?userA=${encodeURIComponent(currentUser.id)}&userB=${encodeURIComponent(selectedContact.id)}`;
    const response = await fetch(url);
    const messages = await response.json();

    if (!Array.isArray(messages) || messages.length === 0) {
        chatMessages.innerHTML = '<p class="empty">Aucun message pour le moment.</p>';
        return;
    }

    chatMessages.innerHTML = '';

    messages.forEach(msg => {
        const bubble = document.createElement('div');
        const mine = Number(msg.sender_id) === Number(currentUser.id);
        bubble.className = `message${mine ? ' mine' : ''}`;
        bubble.innerHTML = `
            <div>${msg.content}</div>
            <div class="meta">${new Date(msg.sent_at).toLocaleString('fr-FR')}</div>
        `;
        chatMessages.appendChild(bubble);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!selectedContact) {
        alert('Sélectionne un contact avant d\'envoyer un message.');
        return;
    }

    const content = messageInput.value.trim();
    if (!content) return;

    await fetch(messagesEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            senderId: currentUser.id,
            receiverId: selectedContact.id,
            content
        })
    });

    messageInput.value = '';
    await loadConversation();
});

await loadContacts();
