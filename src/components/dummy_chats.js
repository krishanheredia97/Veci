document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Initial messages
    const messages = [
        { sender: 'bot', text: 'Hi there! What would you like to order today?' }
    ];

    // Create typing indicator element
    const createTypingIndicator = () => {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.classList.add('typing-dot');
            typingIndicator.appendChild(dot);
        }
        
        return typingIndicator;
    };

    // Function to render messages with animation
    const renderMessages = (newMessage = false) => {
        // If it's a new message, only append that message
        if (newMessage) {
            const msg = messages[messages.length - 1];
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add(msg.sender === 'user' ? 'user-message' : 'bot-message');
            messageElement.textContent = msg.text;
            
            // Add a slight delay for the animation to be visible
            setTimeout(() => {
                chatContainer.appendChild(messageElement);
                // Scroll to bottom of chat
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 10);
        } else {
            // Initial render of all messages
            chatContainer.innerHTML = '';
            messages.forEach((msg, index) => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.classList.add(msg.sender === 'user' ? 'user-message' : 'bot-message');
                messageElement.textContent = msg.text;
                messageElement.style.animationDelay = `${index * 0.1}s`;
                chatContainer.appendChild(messageElement);
            });
            
            // Scroll to bottom of chat
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

    // Function to get bot reply based on user input
    const getBotReply = (userInput) => {
        if (userInput.toLowerCase().includes('burger')) {
            return 'Great choice! Would you like fries with that?';
        }
        if (userInput.toLowerCase().includes('pizza')) {
            return 'Our pizzas are amazing! What toppings would you like?';
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
        
        // Disable input while processing
        messageInput.disabled = true;
        sendButton.disabled = true;
        
        // Add user message
        messages.push({ sender: 'user', text });
        renderMessages(true);
        messageInput.value = '';

        // Show typing indicator
        setTimeout(() => {
            const typingIndicator = createTypingIndicator();
            chatContainer.appendChild(typingIndicator);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // Simulate bot thinking and typing
            setTimeout(() => {
                // Remove typing indicator
                chatContainer.removeChild(typingIndicator);
                
                // Add bot reply
                const reply = getBotReply(text);
                messages.push({ sender: 'bot', text: reply });
                renderMessages(true);
                
                // Re-enable input
                messageInput.disabled = false;
                sendButton.disabled = false;
                messageInput.focus();
            }, 1500);
        }, 500);
    };

    // Event listeners
    sendButton.addEventListener('click', handleSend);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    // Add send icon to button
    sendButton.innerHTML = 'Send';

    // Initial render
    renderMessages();
    
    // Focus input on load
    messageInput.focus();
});
