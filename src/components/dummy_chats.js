document.addEventListener('DOMContentLoaded', () => {
    // Flag to track if the demo has already played
    let demoPlayed = false;
    
    // Check if we're on desktop or mobile
    const isDesktop = window.innerWidth >= 800; // Same breakpoint as in CSS
    // DOM elements
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const cartToggleButton = document.getElementById('cartToggleButton');
    const cartContainer = document.getElementById('cartContainer');
    const cartContent = cartContainer.querySelector('.cart-content');
    const cartItemCountSpan = cartContainer.querySelector('.cart-item-count');
    const cartEmptyMessage = cartContainer.querySelector('.cart-empty-message');

    // Simple cart state (only Bandeja Paisa for this demo)
    let cartItems = [];

    const updateCartUI = () => {
        // Update item count text
        cartItemCountSpan.textContent = `${cartItems.length} artículos`;

        // Remove any existing rendered items
        const existing = cartContent.querySelectorAll('.cart-item');
        existing.forEach(el => el.remove());

        if (cartItems.length === 0) {
            cartEmptyMessage.style.display = 'block';
        } else {
            cartEmptyMessage.style.display = 'none';

            cartItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `\n                    <span class="cart-item-title">${item.title}</span>\n                    <button class=\"remove-from-cart-btn\" aria-label=\"Remove item\">-</button>\n                `;

                const removeBtn = itemDiv.querySelector('.remove-from-cart-btn');
                removeBtn.addEventListener('click', () => {
                    removeItemFromCart(item.id);
                });

                cartContent.appendChild(itemDiv);
            });
        }
    };

    const addItemToCart = (item) => {
        if (!cartItems.some(i => i.id === item.id)) {
            cartItems.push(item);
            updateCartUI();
        }
    };

    const removeItemFromCart = (itemId) => {
        cartItems = cartItems.filter(i => i.id !== itemId);
        updateCartUI();

        // Reset corresponding plus buttons in chat
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            if (btn.classList.contains('added')) {
                btn.classList.remove('added');
                const icon = btn.querySelector('.plus-icon');
                if (icon) icon.textContent = '+';
            }
        });
    };

    // Initialize cart UI in empty state
    updateCartUI();

    // Predefined conversation for demonstration
    const demoConversation = [
        { sender: 'bot', text: '¿Qué más, Veci? 😊 ¿Qué se le antoja? 🍔🔥' },  
        { sender: 'user', text: '¿Tienen mute?' },  
        { sender: 'bot', text: '¡Claro! Nuestro delicioso mute trae mazorca, fríjoles, papa criolla, costilla de cerdo y chorizo' },  
        { sender: 'bot', type: 'image', content: {
            title: 'Mute',
            price: '16.500',
            image: 'assets/images/food_example_1.png'
        }},
        { sender: 'user', text: 'De una👌' } 
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
                    if (!addToCartBtn.classList.contains('added')) {
                        // Add to cart
                        addToCartBtn.classList.add('added');
                        plusIcon.textContent = '-';
                        addItemToCart({ id: 'bandeja-paisa', title: message.content.title, price: message.content.price });
                    } else {
                        // Remove from cart
                        addToCartBtn.classList.remove('added');
                        plusIcon.textContent = '+';
                        removeItemFromCart('bandeja-paisa');
                    }
                });
            }
            
            // Add click event for the read more button
            const cardButton = foodCard.querySelector('.food-card-button');
            
            if (cardButton) {
                // Create description element
                const descriptionElement = document.createElement('p');
                descriptionElement.className = 'food-card-description';
                descriptionElement.textContent = 'Tradicional mute santandereano con costilla de cerdo, chorizo, mazorca tierna, fríjoles rojos, papa criolla y verduras frescas. Servido en olla de barro con cilantro y cebolla larga.';
                
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
    messageInput.placeholder = "Conversación de prueba";

    // Function to check if an element is fully visible in the viewport
    const isElementFullyVisible = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    // Function to handle scroll events for responsive view
    const handleScroll = () => {
        // Only check scroll if we're on mobile and demo hasn't played yet
        if (!isDesktop && !demoPlayed && isElementFullyVisible(chatContainer)) {
            runDemoConversation();
            demoPlayed = true;
            // Remove the scroll listener once demo has played
            window.removeEventListener('scroll', handleScroll);
        }
    };
    
    // If on desktop, play demo immediately
    if (isDesktop) {
        runDemoConversation();
    } else {
        // On mobile, add scroll listener and check initial position
        window.addEventListener('scroll', handleScroll);
        // Check if already visible on load
        setTimeout(() => handleScroll(), 300); // Small delay to ensure DOM is fully rendered
    }
    
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
