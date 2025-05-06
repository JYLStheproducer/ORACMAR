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

        // Simuler une réponse de l'assistant (à remplacer par une vraie API)
        setTimeout(() => {
            hideTypingIndicator();
            respondToMessage(message);
        }, 1500);
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

// Fonction pour générer une réponse (à remplacer par une vraie API)
function respondToMessage(message) {
    let response = 'Je suis désolé, mais je suis actuellement en cours de développement. Bientôt, je pourrai répondre à toutes vos questions concernant l\'OPRAG de manière plus précise.';
    
    // Réponses simples pour la démonstration
    if (message.toLowerCase().includes('services portuaires')) {
        response = 'L\'OPRAG offre une gamme complète de services portuaires, notamment le pilotage, le remorquage, l\'amarrage, et la manutention de différents types de cargaisons.';
    } else if (message.toLowerCase().includes('partenariats')) {
        response = 'L\'OPRAG collabore avec de nombreux partenaires internationaux pour améliorer ses services et développer ses infrastructures portuaires.';
    } else if (message.toLowerCase().includes('actualités')) {
        response = 'Restez informé des dernières actualités de l\'OPRAG concernant les développements portuaires, les nouveaux partenariats et les améliorations de services.';
    }

    addMessage('assistant', response);
}

// Initialisation des événements au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Activer/désactiver le bouton d'envoi en fonction de la saisie
    input.addEventListener('input', () => {
        sendButton.style.opacity = input.value.trim() ? '1' : '0.5';
    });
});