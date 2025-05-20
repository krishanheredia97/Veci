document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.flip-card');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const dots = document.querySelectorAll('.dot');
    const carouselContainer = document.querySelector('.carousel-container');
    
    let currentIndex = 0;
    let isDesktopView = false; // Will be determined dynamically
    let cardWidth = 0; // Will be calculated dynamically
    let cardGap = 30; // Default, will be updated from CSS
    let fakeFlipInterval = null; // For controlling the fake flip animation interval

    function updateCardGap() {
        const carouselStyle = window.getComputedStyle(carousel);
        cardGap = parseFloat(carouselStyle.getPropertyValue('--card-gap')) || parseFloat(carouselStyle.gap) || 30;
    }
    
    // Function to update card dimensions
    function updateCardDimensions() {
        // Get the current width of the first card
        cardWidth = cards[0].offsetWidth;
    }
    
    // Function to start the fake flip animation on the first card
    function startFakeFlipAnimation() {
        // Clear any existing interval
        if (fakeFlipInterval) {
            clearInterval(fakeFlipInterval);
            fakeFlipInterval = null;
        }
        
        // Get the first card (index 0)
        const firstCard = cards[0];
        
        // Add the fake-flip class to start the animation
        firstCard.classList.add('fake-flip');
        
        // Set up an event listener to pause animation when the card is actually flipped
        firstCard.addEventListener('mouseenter', function() {
            firstCard.classList.remove('fake-flip');
        });
        
        firstCard.addEventListener('mouseleave', function() {
            // Only restart if not flipped
            if (!firstCard.classList.contains('flipped')) {
                firstCard.classList.add('fake-flip');
            }
        });
        
        // For touch devices, pause animation when card is flipped
        firstCard.addEventListener('click', function() {
            if (firstCard.classList.contains('flipped')) {
                firstCard.classList.remove('fake-flip');
            } else if (!isDesktopView && currentIndex === 0) {
                // Only add back if it's the current card in mobile view and not flipped
                firstCard.classList.add('fake-flip');
            }
        });
    }
    
    // Initial setup
    updateCardGap();
    updateCardDimensions();
    checkCardsVisibility(); 
    updateActiveCard(currentIndex); // Set initial active card
    updateNavigation();     // This will determine if dots need to be updated and call updateDots internally
    startFakeFlipAnimation(); // Start the fake flip animation on the first card
    
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
        updateActiveCard(currentIndex); // Update active card on resize
        updateNavigation(); // Always update navigation to reflect new state
        
        // If view mode changed or we're in mobile view, ensure proper positioning
        if (wasDesktopView !== isDesktopView || !isDesktopView) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                scrollToCard(currentIndex, false);
            }, 100);
        }
        
        // Update fake flip animation on the first card when view changes
        const firstCard = cards[0];
        if (currentIndex === 0 || isDesktopView) {
            // Re-add fake flip class if it's the first card in mobile view or any card in desktop view
            if (!firstCard.classList.contains('flipped')) {
                firstCard.classList.add('fake-flip');
            }
        } else if (!isDesktopView) {
            // Remove fake flip class if it's not the first card in mobile view
            firstCard.classList.remove('fake-flip');
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
    
    // Function to update fake flip animation based on current index
    function updateFakeFlipAnimation() {
        const firstCard = cards[0];
        
        if (!isDesktopView) {
            // In mobile view, only show animation on the first card when it's visible
            if (currentIndex === 0) {
                // Only add the animation if the card is not flipped
                if (!firstCard.classList.contains('flipped')) {
                    firstCard.classList.add('fake-flip');
                }
            } else {
                // Remove animation when not on the first card
                firstCard.classList.remove('fake-flip');
            }
        } else {
            // In desktop view, always show animation on the first card if not flipped
            if (!firstCard.classList.contains('flipped')) {
                firstCard.classList.add('fake-flip');
            }
        }
    }
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateActiveCard(currentIndex);
            scrollToCard(currentIndex);
            updateNavigation();
            updateDots(currentIndex);
            unflipAllCardsExcept(currentIndex);
            updateFakeFlipAnimation();
        }
    });
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateActiveCard(currentIndex);
            scrollToCard(currentIndex);
            updateNavigation();
            updateDots(currentIndex);
            unflipAllCardsExcept(currentIndex);
            updateFakeFlipAnimation();
        }
    });
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            currentIndex = index;
            updateActiveCard(currentIndex);
            scrollToCard(currentIndex);
            updateNavigation();
            updateDots(currentIndex);
            unflipAllCardsExcept(currentIndex);
            updateFakeFlipAnimation();
        });
    });
    
    // Card click/touch functionality for flipping
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // Only flip the card if it's the current card in mobile view
            // In desktop view, flipping is handled by CSS hover
            if (!isDesktopView && index === currentIndex) {
                card.classList.toggle('flipped');
                
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
            
            // Update UI - order matters here
            updateDots(currentIndex);
            updateNavigation();
            scrollToCard(currentIndex); // This will also call updateActiveCard
            unflipAllCardsExcept(currentIndex);
        } else {
            // If swipe wasn't significant, make sure we're still properly positioned
            scrollToCard(currentIndex, true);
        }
    }, { passive: false }); // Changed to non-passive to allow preventDefault in some cases
    
    // Helper functions
    function scrollToCard(index, smooth = true) {
        if (isDesktopView) return; // No need to scroll in desktop view
        
        // Use a simpler, more reliable approach for mobile
        // Calculate position based on card index, width and gap
        const scrollPosition = index * (cardWidth + cardGap);
        
        // Apply the scroll
        carousel.scrollTo({
            left: scrollPosition,
            behavior: smooth ? 'smooth' : 'auto'
        });
        
        // Force update active card
        updateActiveCard(index);
    }
    
    function updateDots(index) {
        // This function assumes the dots-container visibility is handled by updateNavigation.
        // It only focuses on setting the active class.
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Function to update which card is active (visible) in mobile view
    function updateActiveCard(index) {
        if (isDesktopView) {
            // In desktop view, all cards are visible in grid layout
            cards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.visibility = 'visible';
                card.style.position = 'relative';
                card.style.zIndex = '1';
                card.classList.remove('active');
                // Reset any transforms
                card.style.transform = '';
            });
            return;
        }
        
        // In mobile view, create a smoother transition between cards
        cards.forEach((card, i) => {
            // Keep all cards in the flow for proper sizing and positioning
            card.style.display = 'block';
            card.style.position = 'relative';
            
            // Calculate the position relative to the active card
            const positionDiff = i - index;
            
            if (i === index) {
                // Active card
                card.classList.add('active');
                card.style.opacity = '1';
                card.style.visibility = 'visible';
                card.style.zIndex = '2';
                card.style.transform = 'scale(1)';
            } else if (i === index - 1) {
                // Card to the left (previous)
                card.classList.remove('active');
                card.style.opacity = '0.5'; // Semi-visible during transition
                card.style.visibility = 'visible';
                card.style.zIndex = '1';
                card.style.transform = 'translateX(-50%) scale(0.95)';
                
                // Fade it out completely after transition completes
                setTimeout(() => {
                    if (i !== currentIndex && i !== currentIndex - 1 && i !== currentIndex + 1) {
                        card.style.opacity = '0';
                        card.style.visibility = 'hidden';
                    }
                }, 400); // Match transition duration in CSS
            } else if (i === index + 1) {
                // Card to the right (next)
                card.classList.remove('active');
                card.style.opacity = '0.5'; // Semi-visible during transition
                card.style.visibility = 'visible';
                card.style.zIndex = '1';
                card.style.transform = 'translateX(50%) scale(0.95)';
                
                // Fade it out completely after transition completes
                setTimeout(() => {
                    if (i !== currentIndex && i !== currentIndex - 1 && i !== currentIndex + 1) {
                        card.style.opacity = '0';
                        card.style.visibility = 'hidden';
                    }
                }, 400); // Match transition duration in CSS
            } else {
                // Cards further away
                card.classList.remove('active');
                card.style.opacity = '0';
                card.style.visibility = 'hidden';
                card.style.zIndex = '0';
                card.style.transform = positionDiff < 0 ? 'translateX(-100%)' : 'translateX(100%)';
            }
        });
    }

    function updateNavigation() {
        const dotsContainer = document.querySelector('.dots-container');

        if (isDesktopView) { 
            // Case 1: All cards fit in the main carousel-container (true desktop view)
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            carousel.scrollLeft = 0; // Ensure it's at the start
            carouselContainer.classList.remove('carousel-active'); // Remove padding in desktop view
            return;
        }
        
        // Add carousel-active class when in carousel mode
        carouselContainer.classList.add('carousel-active');

        // Case 2: Not isDesktopView. Check if the .carousel element itself is scrollable.
        const isCarouselActuallyScrollable = carousel.scrollWidth > carousel.clientWidth + 1; // +1 for subpixel buffer

        if (isCarouselActuallyScrollable) {
            // Carousel is scrollable, so show nav and manage state
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            if (dotsContainer) dotsContainer.style.display = 'flex';

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = cards.length === 0 || currentIndex >= cards.length - 1;

            if (cards.length <= 1) { // Handles 0 or 1 card
                prevBtn.disabled = true;
                nextBtn.disabled = true;
            }
            updateDots(currentIndex); // Call simplified updateDots
        } else {
            // Carousel is NOT scrollable (all its content fits within its own viewport)
            // This means even in 'carousel mode', no navigation is needed.
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            carousel.scrollLeft = 0; // Ensure it's at the start
        }
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
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                scrollToCard(currentIndex);
                updateNavigation();
                updateDots(currentIndex);
                unflipAllCardsExcept(currentIndex);
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentIndex > 0) {
                currentIndex--;
                scrollToCard(currentIndex);
                updateNavigation();
                updateDots(currentIndex);
                unflipAllCardsExcept(currentIndex);
            }
        }
    });
});
