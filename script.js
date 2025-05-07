// Gestion des messages du chat
let messageHistory = [];

// Configuration de l'API
const API_URL = 'https://chatbobackend.onrender.com/api/chat';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

// Fonction pour gérer l'envoi de messages via la touche Entrée
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Fonction pour envoyer un message avec retry
async function sendMessageWithRetry(message, retryCount = 0) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'same-origin',
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return sendMessageWithRetry(message, retryCount + 1);
        }
        throw error;
    }
}

// Fonction pour envoyer un message
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();

    if (message) {
        addMessage('user', message);
        input.value = '';
        showTypingIndicator();

        try {
            const data = await sendMessageWithRetry(message);
            hideTypingIndicator();
            if (data.response) {
                addMessage('assistant', data.response);
            } else {
                throw new Error('Réponse invalide du serveur');
            }
        } catch (error) {
            hideTypingIndicator();
            console.error('Erreur:', error);
            let errorMessage = 'Désolé, une erreur est survenue. ';
            
            if (error.message.includes('CORS')) {
                errorMessage += 'Problème de connexion au serveur. ';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Impossible de joindre le serveur. ';
            }
            
            errorMessage += 'Veuillez réessayer dans quelques instants.';
            addMessage('assistant', errorMessage);
        }
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

// Fonction pour faire défiler vers le bas
function scrollToBottom() {
    const messagesWrapper = document.querySelector('.messages-wrapper');
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
}

// Fonction pour envoyer une question rapide
function sendQuickQuestion(category) {
    const questions = {
        'services': 'Quels sont les services portuaires disponibles ?',
        'partenariats': 'Pouvez-vous me parler des partenariats actuels ?',
        'actualites': 'Quelles sont les dernières actualités ?'
    };

    if (questions[category]) {
        document.getElementById('user-input').value = questions[category];
        sendMessage();
    }
}
