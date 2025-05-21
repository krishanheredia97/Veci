document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const cartToggleButton = document.getElementById('cartToggleButton');
    const cartContainer = document.getElementById('cartContainer');

    // Predefined conversation for demonstration
    const demoConversation = [
        { sender: 'bot', text: '¿Qué más, Veci? 😊 ¿Qué se le antoja? 🍔🔥' },  
        { sender: 'user', text: '¡Sí! ¿Qué me recomiendas?' },  
        { sender: 'bot', text: '¡Nuestra Hamburguesa Picante de Pollo es LA favorita! 🔥 ¿Quieres probarla con unas papas crujientes? 🍟✨' },  
        { sender: 'bot', type: 'image', content: {
            title: 'Bandeja Paisa',
            price: '16.500',
            image: 'assets/images/food_example_1.png'
        }},
        { sender: 'user', text: '¡Suena perfecto! Añade un refresco también.' },  
        { sender: 'bot', text: '¡Excelente elección! 📝✔️ Una Hamburguesa Picante, papas 🍟 y un refresco 🥤. ¿Algo más o confirmamos el pedido? 😊' },  
        { sender: 'user', text: '¡Confirmar, por favor!' },  
        { sender: 'bot', text: '¡Listo! 🎉 Tu pedido estará listo en 15 minutos. ¡Gracias por elegirnos! ❤️ ¡Que lo disfrutes! 😋' }  
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
        
        if (message.type === 'image') {
            // Create food card for image type message
            const foodCard = document.createElement('div');
            foodCard.classList.add('food-card');
            foodCard.innerHTML = `
                <div class="food-card-image-container">
                    <img src="${message.content.image}" alt="${message.content.title}" class="food-card-image">
                    <button class="add-to-cart-btn" aria-label="Add to cart">
                        <span class="plus-icon">+</span>
                    </button>
                </div>
                <div class="food-card-content">
                    <div class="food-card-info">
                        <h3 class="food-card-title">${message.content.title}</h3>
                        <p class="food-card-price">${message.content.price}</p>
                    </div>
                    <button class="food-card-button">Leer más</button>
                </div>
            `;
            
            // Add click event for the add-to-cart button
            const addToCartBtn = foodCard.querySelector('.add-to-cart-btn');
            const plusIcon = foodCard.querySelector('.plus-icon');
            
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', function() {
                    addToCartBtn.classList.toggle('added');
                    if (addToCartBtn.classList.contains('added')) {
                        plusIcon.textContent = '-';
                    } else {
                        plusIcon.textContent = '+';
                    }
                });
            }
            
            // Add click event for the read more button
            const cardButton = foodCard.querySelector('.food-card-button');
            
            if (cardButton) {
                // Create description element
                const descriptionElement = document.createElement('p');
                descriptionElement.className = 'food-card-description';
                descriptionElement.textContent = 'Deliciosa hamburguesa de pollo con salsa picante casera, lechuga fresca, tomate, cebolla caramelizada y queso derretido. Servida en pan artesanal tostado con mayonesa de chipotle.';
                
                // Insert description after card info
                const cardInfo = foodCard.querySelector('.food-card-info');
                cardInfo.after(descriptionElement);
                
                cardButton.addEventListener('click', function() {
                    foodCard.classList.toggle('expanded');
                    if (foodCard.classList.contains('expanded')) {
                        cardButton.textContent = 'Leer menos';
                    } else {
                        cardButton.textContent = 'Leer más';
                    }
                });
            }
            
            messageElement.appendChild(foodCard);
        } else {
            // Regular text message
            messageElement.textContent = message.text;
        }
        
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
        
        // Timeline for the demo conversation (total ~15 seconds)
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
                
                // Show food card image after a short delay
                setTimeout(() => {
                    addMessage(demoConversation[3]);
                }, 800);
            }, 1500);
        }, 3500);

        setTimeout(() => {
            // Second user message (now at index 4 due to added food card)
            addMessage(demoConversation[4]);
        }, 7000);
        
        setTimeout(() => {
            // Show typing indicator for third bot message
            const typingIndicator = showTypingIndicator();
            
            setTimeout(() => {
                // Remove typing indicator and show third bot message
                chatContainer.removeChild(typingIndicator);
                addMessage(demoConversation[5]);
            }, 1500);
        }, 9000);
        
        setTimeout(() => {
            // Third user message
            addMessage(demoConversation[6]);
        }, 12000);
        
        setTimeout(() => {
            // Show typing indicator for final bot message
            const typingIndicator = showTypingIndicator();
            
            setTimeout(() => {
                // Remove typing indicator and show final bot message
                chatContainer.removeChild(typingIndicator);
                addMessage(demoConversation[7]);
            }, 1500);
        }, 14000);
    };

    // Disable the input field and button since this is just a demo
    messageInput.disabled = true;
    sendButton.disabled = true;
    messageInput.placeholder = "Demo mode - conversation plays automatically";

    // Run the demo conversation immediately
    runDemoConversation();
    
    // Set up the loop to repeat the demo every 18 seconds (adjusted for longer conversation)
    setInterval(runDemoConversation, 18000);
    
    // Cart toggle functionality
    let isCartExpanded = false;
    
    cartToggleButton.addEventListener('click', () => {
        isCartExpanded = !isCartExpanded;
        
        if (isCartExpanded) {
            // Expand cart
            cartContainer.classList.add('expanded');
            chatContainer.classList.add('cart-expanded');
        } else {
            // Collapse cart
            cartContainer.classList.remove('expanded');
            chatContainer.classList.remove('cart-expanded');
        }
    });
});
