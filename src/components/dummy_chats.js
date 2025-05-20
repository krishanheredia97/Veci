document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Initial messages
    const messages = [
        { sender: 'bot', text: 'Hi there! What would you like to order today?' }
    ];

    // Function to render messages
    const renderMessages = () => {
        chatContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add(msg.sender === 'user' ? 'user-message' : 'bot-message');
            messageElement.textContent = msg.text;
            chatContainer.appendChild(messageElement);
        });
        
        // Scroll to bottom of chat
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    // Function to get bot reply based on user input
    const getBotReply = (userInput) => {
        if (userInput.toLowerCase().includes('burger')) {
            return 'Great choice! Would you like fries with that?';
        }
        if (userInput.toLowerCase().includes('yes')) {
            return 'Awesome! Anything else?';
        }
        if (userInput.toLowerCase().includes('no')) {
            return 'Got it. Your order will be ready soon!';
        }
        return 'Sounds good! Do you want anything to drink?';
    };

    // Function to handle sending a message
    const handleSend = () => {
        const text = messageInput.value.trim();
        if (!text) return;
        
        // Add user message
        messages.push({ sender: 'user', text });
        renderMessages();
        messageInput.value = '';

        // Simulate bot typing delay
        setTimeout(() => {
            const reply = getBotReply(text);
            messages.push({ sender: 'bot', text: reply });
            renderMessages();
        }, 800);
    };

    // Event listeners
    sendButton.addEventListener('click', handleSend);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    // Initial render
    renderMessages();
});
