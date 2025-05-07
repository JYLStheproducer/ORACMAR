// Gestion des messages du chat
let messageHistory = [];

// Fonction pour gérer l'envoi de messages via la touche Entrée
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Fonction pour envoyer un message
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();

    if (message) {
        addMessage('user', message);
        input.value = '';
        showTypingIndicator();

        // ✅ URL Render avec endpoint correct + mode CORS
        fetch('https://chatbobackend.onrender.com/api/chat', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            hideTypingIndicator();
            if (data.status === 'success') {
                addMessage('assistant', data.response);
            } else {
                addMessage('assistant', 'Désolé, une erreur est survenue. Veuillez réessayer.');
            }
        })
        .catch(error => {
            hideTypingIndicator();
            addMessage('assistant', 'Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.');
            console.error('Erreur:', error);
        });
    }
}

// Fonction pour ajouter un message au chat
function addMessage(sender, text) {
    const messagesContainer = document.getElementById('chat-messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'message-icon';
    iconDiv.innerHTML = sender === 'user' ? 
        '<i class="fas fa-user"></i>' : 
        '<i class="fas fa-robot"></i>';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';

    const senderName = document.createElement('div');
    senderName.className = 'message-sender';
    senderName.textContent = sender === 'user' ? 'Vous' : 'NEOS';

    const messageBody = document.createElement('div');
    messageBody.className = 'message-body';
    messageBody.textContent = text;

    textDiv.appendChild(senderName);
    textDiv.appendChild(messageBody);
    messageContent.appendChild(iconDiv);
    messageContent.appendChild(textDiv);
    messageDiv.appendChild(messageContent);

    messagesContainer.appendChild(messageDiv);
    messageHistory.push({ sender, text });

    // Animation d'apparition
    requestAnimationFrame(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    });

    // Scroll automatique vers le bas
    scrollToBottom();
}

// Fonction pour afficher l'indicateur de frappe
function showTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator.style.display = 'block';
    scrollToBottom();
}

// Fonction pour masquer l'indicateur de frappe
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator.style.display = 'none';
}

// Fonction pour faire défiler automatiquement vers le bas
function scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fonction pour gérer les questions rapides
function sendQuickQuestion(type) {
    let question = '';
    switch(type) {
        case 'services':
            question = 'Pouvez-vous me présenter les services portuaires de l\'OPRAG ?';
            break;
        case 'partenariats':
            question = 'Quels sont les principaux partenariats de l\'OPRAG ?';
            break;
        case 'actualites':
            question = 'Quelles sont les dernières actualités de l\'OPRAG ?';
            break;
    }
    if (question) {
        const input = document.getElementById('user-input');
        input.value = question;
        sendMessage();
    }
}

// Initialisation des événements au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    input.addEventListener('input', () => {
        sendButton.style.opacity = input.value.trim() ? '1' : '0.5';
    });
});
