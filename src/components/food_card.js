// Food Card Component JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get the food card elements
    const foodCards = document.querySelectorAll('.food-card');
    
    foodCards.forEach(card => {
        // Create the description element
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'food-card-description';
        descriptionElement.textContent = 'Auténtica Bandeja Paisa, una generosa combinación de arroz blanco, frijoles rojos, carne molida, chicharrón, huevo frito, plátano maduro, aguacate y arepa. Todo acompañado de una deliciosa hogao y, si lo deseas, una morcilla para completar la experiencia.';
        
        // Get the card content and button elements
        const cardContent = card.querySelector('.food-card-content');
        const cardInfo = card.querySelector('.food-card-info');
        const cardButton = card.querySelector('.food-card-button');
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        const plusIcon = card.querySelector('.plus-icon');
        
        // Insert the description after the card info
        cardInfo.after(descriptionElement);
        
        // Add click event listener to the button
        cardButton.addEventListener('click', function() {
            // Toggle the expanded class on the card
            card.classList.toggle('expanded');
            
            // Update the button text based on the expanded state
            if (card.classList.contains('expanded')) {
                cardButton.textContent = 'Leer menos';
            } else {
                cardButton.textContent = 'Leer más';
            }
        });
        
        // Add click event listener to the add-to-cart button
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // Toggle the 'added' class on the button
                addToCartBtn.classList.toggle('added');
                
                // Update the icon based on the added state
                if (addToCartBtn.classList.contains('added')) {
                    plusIcon.textContent = '-';
                } else {
                    plusIcon.textContent = '+';
                }
            });
        }
    });
    
    console.log('Food card component loaded successfully');
});
