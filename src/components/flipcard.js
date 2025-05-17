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

    function updateCardGap() {
        const carouselStyle = window.getComputedStyle(carousel);
        cardGap = parseFloat(carouselStyle.getPropertyValue('--card-gap')) || parseFloat(carouselStyle.gap) || 30;
    }
    
    // Function to update card dimensions
    function updateCardDimensions() {
        // Get the current width of the first card
        cardWidth = cards[0].offsetWidth;
    }
    
    // Initial setup
    updateCardGap();
    updateCardDimensions();
    checkCardsVisibility(); 
    updateActiveCard(currentIndex); // Set initial active card
    updateNavigation();     // This will determine if dots need to be updated and call updateDots internally
    
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
    });
    
    // Function to check if we're in desktop or mobile view
    function checkCardsVisibility() {
        // Check if we're in landscape mode and minimum width for desktop view
        isDesktopView = window.matchMedia('(min-width: 768px) and (orientation: landscape)').matches;
        
        // If we're in mobile view, make sure all cards are displayed for swiping
        if (!isDesktopView) {
            cards.forEach(card => {
                card.style.display = 'block';
                // Reset any transforms that might affect positioning
                card.style.transform = '';
            });
            
            // Reset carousel scroll position if needed
            if (carousel.scrollLeft > 0 && currentIndex === 0) {
                carousel.scrollLeft = 0;
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
        });
    });
    
    // Card click/touch functionality for flipping
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // Only flip the card if it's the current card in mobile view
            // or if we're in desktop view (all cards can be flipped)
            // Ensure card flipping does not by itself cause navigation or dot changes.
            if (isDesktopView || index === currentIndex) {
                card.classList.toggle('flipped');
                
                // In mobile view, ensure only one card is flipped at a time
                if (!isDesktopView && card.classList.contains('flipped')) {
                    unflipAllCardsExcept(index);
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
    }, { passive: true });
    
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
            // In desktop view, all cards are visible
            cards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('active');
            });
            return;
        }
        
        // In mobile view, all cards are visible for swiping, but only one is active
        cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
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
