document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Predefined conversation for demonstration
    const demoConversation = [
        { sender: 'bot', text: 'Hi there! How can I help you today?' },
        { sender: 'user', text: 'I need information about your services' },
        { sender: 'bot', text: 'We offer AI-powered solutions for businesses of all sizes. Would you like to schedule a demo?' },
        { sender: 'user', text: 'Yes, that would be great!' }
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

    // Function to add a message to the chat container
    const addMessage = (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(message.sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message.text;
        
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    // Function to clear the chat container
    const clearChat = () => {
        chatContainer.innerHTML = '';
    };

    // Function to show typing indicator
    const showTypingIndicator = () => {
        const typingIndicator = createTypingIndicator();
        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return typingIndicator;
    };

    // Function to run the demo conversation
    const runDemoConversation = () => {
        // Clear the chat to start fresh
        clearChat();
        
        // Timeline for the demo conversation (total ~9 seconds)
        setTimeout(() => {
            // First bot message
            addMessage(demoConversation[0]);
        }, 500);

        setTimeout(() => {
            // First user message
            addMessage(demoConversation[1]);
        }, 2000);

        setTimeout(() => {
            // Show typing indicator for second bot message
            const typingIndicator = showTypingIndicator();
            
            setTimeout(() => {
                // Remove typing indicator and show second bot message
                chatContainer.removeChild(typingIndicator);
                addMessage(demoConversation[2]);
            }, 1500);
        }, 3500);

        setTimeout(() => {
            // Second user message
            addMessage(demoConversation[3]);
        }, 7000);
    };

    // Disable the input field and button since this is just a demo
    messageInput.disabled = true;
    sendButton.disabled = true;
    messageInput.placeholder = "Demo mode - conversation plays automatically";

    // Run the demo conversation immediately
    runDemoConversation();
    
    // Set up the loop to repeat the demo every 9 seconds
    setInterval(runDemoConversation, 9000);
});
