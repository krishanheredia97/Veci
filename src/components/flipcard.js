// Import the guide message component
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.flip-card');
    const carouselContainer = document.querySelector('.carousel-container');
    let navPrevButton, navNextButton;
    
    let currentIndex = 0;
    let isDesktopView = false; // Will be determined dynamically
    let cardWidth = 0; // Will be calculated dynamically
    let cardGap = 30; // Default, will be updated from CSS
    let hasUserFlippedCard = false; // Track if user has manually flipped a card
    let demonstrationInterval = null; // Interval for repeating demonstration
    let demoPlayed = false; // Track if the demo has already played
    
    // Initialize guide message component
    const guideMessage = new GuideMessage({
        parentSelector: '.flip-card',
        showDelay: 500
    });
    guideMessage.init();

    function updateCardGap() {
        const carouselStyle = window.getComputedStyle(carousel);
        cardGap = parseFloat(carouselStyle.getPropertyValue('--card-gap')) || parseFloat(carouselStyle.gap) || 30;
    }
    
    // Function to update card dimensions
    function updateCardDimensions() {
        // Get the current width of the first card
        cardWidth = cards[0].offsetWidth;
    }
    
    // Function to check if an element or the nav buttons container is visible in the viewport
    function isElementFullyVisible(el) {
        // First check if the nav buttons container exists and is visible
        const navButtonsContainer = document.querySelector('.flipcard-nav-buttons-container');
        if (navButtonsContainer) {
            const navRect = navButtonsContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // If the nav buttons are visible in the viewport, return true
            if (navRect.top < windowHeight && navRect.bottom > 0) {
                return true;
            }
        }
        
        // Fall back to checking the provided element
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            // At least some part is visible vertically
            rect.top < windowHeight && rect.bottom > 0 &&
            // Fully visible horizontally
            rect.left >= 0 && rect.right <= windowWidth
        );
    }

    // Function to demonstrate the flip functionality and repeat every second
    function demonstrateFlip() {
        // Don't demonstrate if user has manually flipped a card or if demo has already played
        if (hasUserFlippedCard || demoPlayed) return;
        
        // Mark that demo has played
        demoPlayed = true;
        
        // Immediately do a partial flip of the card for the first demonstration
        // Only proceed if user hasn't manually flipped a card
        if (!hasUserFlippedCard) {
            // Get the first visible card
            const firstCard = isDesktopView ? cards[0] : cards[currentIndex];
            const cardIndex = isDesktopView ? 0 : currentIndex;
            
            // Show guide message
            guideMessage.show(cardIndex);
            
            // Partially flip the card to hint at functionality
            firstCard.classList.add('partial-flip');
            
            // Flip back after 0.5 seconds
            setTimeout(() => {
                firstCard.classList.remove('partial-flip');
            }, 500);
        }
        
        // Set up interval to repeat demonstration every second
        // Clear any existing interval first
        if (demonstrationInterval) {
            clearInterval(demonstrationInterval);
        }
        
        demonstrationInterval = setInterval(() => {
            // Only demonstrate if user hasn't manually flipped a card
            if (!hasUserFlippedCard) {
                const firstCard = isDesktopView ? cards[0] : cards[currentIndex];
                const cardIndex = isDesktopView ? 0 : currentIndex;
                
                // Show guide message
                guideMessage.show(cardIndex);
                
                // Add the partial-flip class
                firstCard.classList.add('partial-flip');
                
                // Remove the class after 0.5 seconds to complete the animation
                setTimeout(() => {
                    firstCard.classList.remove('partial-flip');
                }, 500);
            } else {
                // If user has flipped a card, stop the interval
                clearInterval(demonstrationInterval);
                demonstrationInterval = null;
                
                // Hide all guide messages
                guideMessage.hideAll();
            }
        }, 1500); // Repeat every 1.5 seconds
    }
    
    // Add mouse enter event listeners for desktop hover detection
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Only consider it a manual flip in desktop/landscape mode
            if (isDesktopView) {
                hasUserFlippedCard = true;
                
                // Clear the demonstration interval if it exists
                if (demonstrationInterval) {
                    clearInterval(demonstrationInterval);
                    demonstrationInterval = null;
                }
                
                // Mark user interaction and hide all guide messages
                guideMessage.setUserInteracted();
            }
        });
    });
    
    // Function to handle scroll events to check when cards become visible
    function handleScroll() {
        // Only check if demo hasn't played yet
        if (!demoPlayed && isElementFullyVisible(carouselContainer)) {
            demonstrateFlip();
            // Remove the scroll listener once demo has played
            window.removeEventListener('scroll', handleScroll);
        }
    }

    // Initial setup
    updateCardGap();
    updateCardDimensions();
    checkCardsVisibility(); 
    updateActiveCard(currentIndex); // Set initial active card
    updateNavigation();     // This will determine if dots need to be updated and call updateDots internally
    
    // Add scroll listener to check when cards become visible
    window.addEventListener('scroll', handleScroll);
    
    // Check if already visible on load - use minimal delay to ensure DOM is ready
    setTimeout(() => handleScroll(), 100);
    
    // Always ensure proper initial positioning on mobile
    if (!isDesktopView) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
            scrollToCard(currentIndex, false);
        }, 100);
    }
    
    // Check if we're in desktop or mobile view on resize
    window.addEventListener('resize', () => {
        const wasDesktopView = isDesktopView;
        
        updateCardGap();
        updateCardDimensions();
        checkCardsVisibility(); 
        updateArrowButtonsVisibility(); // Update arrow buttons based on current index
        updateNavigation(); // Always update navigation to reflect new state
        updateArrowButtonsVisibility(); // Ensure arrows update on resize
        
        // If view mode changed or we're in mobile view, ensure proper positioning
        if (wasDesktopView !== isDesktopView || !isDesktopView) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                scrollToCard(currentIndex, false);
            }, 100);
        }
        
        // If view mode changed, we might want to re-demonstrate the flip
        // but only if user hasn't manually flipped a card and demo hasn't played yet
        if (wasDesktopView !== isDesktopView && !hasUserFlippedCard && !demoPlayed) {
            // Check if the carousel is visible before demonstrating
            if (isElementFullyVisible(carouselContainer)) {
                demonstrateFlip();
            }
        }
    });
    
    // Function to check if we're in desktop or mobile view
    function checkCardsVisibility() {
        // Check if we're in landscape mode and minimum width for desktop view
        isDesktopView = window.matchMedia('(min-width: 768px) and (orientation: landscape)').matches;
        
        if (isDesktopView) {
            // In desktop view, show all cards in a single row
            cards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.visibility = 'visible';
                card.style.position = 'relative';
                card.style.zIndex = '1';
                // Reset any transforms that might affect positioning
                card.style.transform = '';
            });
            
            // Add class to container for desktop styling
            carouselContainer.classList.remove('carousel-active');
        } else {
            // In mobile view, prepare all cards for proper visibility handling
            cards.forEach((card, i) => {
                // All cards need to be in the flow for proper sizing and positioning
                card.style.display = 'block';
                card.style.position = 'relative'; // All cards need to be relative positioned
                card.style.transform = ''; // Reset any transforms
                
                // Only the current card should be visible
                if (i === currentIndex) {
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                    card.style.zIndex = '2';
                } else {
                    card.style.opacity = '0';
                    card.style.visibility = 'hidden';
                    card.style.zIndex = '1';
                }
            });
            
            // Add class to container for mobile carousel styling
            carouselContainer.classList.add('carousel-active');
            
            // Reset carousel scroll position if needed
            if (carousel.scrollLeft > 0 && currentIndex === 0) {
                carousel.scrollLeft = 0;
            }
        }
    }
    
    // Function to re-demonstrate flip functionality when changing cards
    // This is optional - only if you want to demonstrate on each new card
    function checkForDemonstration() {
        // We could re-demonstrate on new cards, but for now we'll just use the first visit demo
        // This function is kept as a placeholder in case you want to expand this behavior later
    }
    
    // Initial setup for arrow buttons
    createArrowButtons();

    // Card click/touch functionality for flipping
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // Only flip the card if it's the current card in mobile view
            // In desktop view, flipping is handled by CSS hover
            if (!isDesktopView && index === currentIndex) {
                card.classList.toggle('flipped');
                
                // Mark that user has manually flipped a card
                hasUserFlippedCard = true;
                
                // Clear the demonstration interval if it exists
                if (demonstrationInterval) {
                    clearInterval(demonstrationInterval);
                    demonstrationInterval = null;
                }
                
                // Mark user interaction and hide all guide messages
                guideMessage.setUserInteracted();
                
                // In mobile view, ensure only one card is flipped at a time
                if (card.classList.contains('flipped')) {
                    unflipAllCardsExcept(index);
                    
                    // Remove fake flip animation when card is flipped
                    if (index === 0) {
                        card.classList.remove('fake-flip');
                    }
                } else {
                    // Add fake flip animation back when card is unflipped (if it's the first card)
                    if (index === 0) {
                        card.classList.add('fake-flip');
                    }
                }
            }
        });
        
        // Add touchend handler directly to each card for more responsive flipping on mobile
        card.addEventListener('touchend', (e) => {
            // Prevent this touchend from triggering a click event
            e.preventDefault();
            
            // Only flip if this is the current card in mobile view
            // In desktop view, flipping is handled by CSS hover
            if (!isDesktopView && index === currentIndex) {
                // Check if this is a tap (not a swipe)
                if (Math.abs(e.changedTouches[0].screenX - touchStartX) < 10) {
                    card.classList.toggle('flipped');
                    
                    // Mark that user has manually flipped a card
                    hasUserFlippedCard = true;
                    
                    // Clear the demonstration interval if it exists
                    if (demonstrationInterval) {
                        clearInterval(demonstrationInterval);
                        demonstrationInterval = null;
                    }
                    
                    // Mark user interaction and hide all guide messages
                    guideMessage.setUserInteracted();
                    
                    // In mobile view, ensure only one card is flipped at a time
                    if (card.classList.contains('flipped')) {
                        unflipAllCardsExcept(index);
                        
                        // Remove fake flip animation when card is flipped
                        if (index === 0) {
                            card.classList.remove('fake-flip');
                        }
                    } else {
                        // Add fake flip animation back when card is unflipped (if it's the first card)
                        if (index === 0) {
                            card.classList.add('fake-flip');
                        }
                    }
                }
            }
        });
    });
    
    // Simplified touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        if (isDesktopView) return; // No need to handle this in desktop view
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        if (isDesktopView) return; // No need to handle this in desktop view
        
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        const threshold = window.innerWidth * 0.15; // 15% of screen width as threshold
        
        // Only register swipe if it's significant enough (prevent accidental swipes)
        if (Math.abs(swipeDistance) > threshold) {
            // Swipe right (previous)
            if (swipeDistance > 0 && currentIndex > 0) {
                currentIndex--;
            }
            // Swipe left (next)
            else if (swipeDistance < 0 && currentIndex < cards.length - 1) {
                currentIndex++;
            }
            
            // A significant swipe occurred, update the card.
            showCard(currentIndex); // This will handle active card, scroll, nav, unflip, and demo.
        } else {
            // If swipe wasn't significant, make sure we're still properly positioned.
            scrollToCard(currentIndex, true);
        }
    }, { passive: false }); // End of touchend event listener

    // Helper functions
    // (Assuming scrollToCard, createArrowButtons, updateArrowButtonsVisibility, 
    // showPrevCard, showNextCard, showCard, updateActiveCard are defined below correctly and only once)

    function scrollToCard(index, smooth = true) {
        if (!carousel) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(window.getComputedStyle(carousel).getPropertyValue('gap')) || 0;
    const scrollAmount = index * (cardWidth + gap);
    
    carousel.scrollTo({
        left: scrollAmount,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

function createArrowButtons() {
        if (!carouselContainer) return;
        let navButtonsContainer = carouselContainer.querySelector('.flipcard-nav-buttons-container');
        if (!navButtonsContainer) {
            navButtonsContainer = document.createElement('div');
            navButtonsContainer.className = 'flipcard-nav-buttons-container';
            if (carousel.nextSibling) {
                carouselContainer.insertBefore(navButtonsContainer, carousel.nextSibling);
            } else {
                carouselContainer.appendChild(navButtonsContainer);
            }
        }

        navPrevButton = document.createElement('button');
        navPrevButton.className = 'flipcard-nav-button nav-prev';
        navPrevButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
        navPrevButton.setAttribute('aria-label', 'Previous card');
        navPrevButton.addEventListener('click', () => showPrevCard());

        navNextButton = document.createElement('button');
        navNextButton.className = 'flipcard-nav-button nav-next';
        navNextButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
        navNextButton.setAttribute('aria-label', 'Next card');
        navNextButton.addEventListener('click', () => showNextCard());

        navButtonsContainer.appendChild(navPrevButton);
        navButtonsContainer.appendChild(navNextButton);
        updateArrowButtonsVisibility();
    }

    function updateArrowButtonsVisibility() {
        if (!navPrevButton || !navNextButton) return;
        if (isDesktopView) {
            navPrevButton.classList.add('hidden');
            navNextButton.classList.add('hidden');
            return;
        }
        navPrevButton.classList.toggle('hidden', currentIndex === 0);
        navNextButton.classList.toggle('hidden', currentIndex === cards.length - 1 && cards.length > 0);
    }

    function showPrevCard() {
        if (currentIndex > 0) {
            currentIndex--;
            showCard(currentIndex);
        }
    }

    function showNextCard() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            showCard(currentIndex);
        }
    }

    function showCard(index) {
        currentIndex = index;
        updateActiveCard(currentIndex);
        scrollToCard(currentIndex);
        updateNavigation(); 
        updateArrowButtonsVisibility(); 
        unflipAllCardsExcept(currentIndex);
        checkForDemonstration();
    }

    function updateActiveCard(index) {
        if (isDesktopView) {
            cards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('active');
            });
            return;
        }
        
        cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
                card.style.opacity = '1';
                card.style.visibility = 'visible';
            } else {
                card.classList.remove('active');
            }
        });
    }

    function updateNavigation() {
        const navButtonsContainer = carouselContainer.querySelector('.flipcard-nav-buttons-container');
        if (!navButtonsContainer) return;

        if (isDesktopView) {
            navButtonsContainer.style.display = 'none';
            carouselContainer.classList.remove('carousel-active');
            carousel.scrollLeft = 0;
            updateArrowButtonsVisibility(); // Ensure arrows are hidden
            return;
        }

        carouselContainer.classList.add('carousel-active');
        const isCarouselActuallyScrollable = carousel.scrollWidth > carousel.clientWidth + 1;

        if (isCarouselActuallyScrollable && cards.length > 1) {
            navButtonsContainer.style.display = 'flex';
        } else {
            navButtonsContainer.style.display = 'none';
        }
        updateArrowButtonsVisibility(); // Update individual button states
    }

    function unflipAllCardsExcept(activeIndex) {
        cards.forEach((card, index) => {
            if (index !== activeIndex) {
                card.classList.remove('flipped');
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isDesktopView) return; // No need to handle this in desktop view
        
        if (e.key === 'ArrowRight') {
            showNextCard();
        } else if (e.key === 'ArrowLeft') {
            showPrevCard();
        }
    });
});
