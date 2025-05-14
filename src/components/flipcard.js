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
    const cardGap = parseInt(window.getComputedStyle(carousel).gap) || 30;
    
    // Function to update card dimensions
    function updateCardDimensions() {
        // Get the current width of the first card
        cardWidth = cards[0].offsetWidth;
    }
    
    // Initial calculation of card dimensions
    updateCardDimensions();
    
    // Check if all cards fit in the viewport
    checkCardsVisibility();
    
    // Initialize
    updateNavigation();
    updateDots(currentIndex);
    
    // Check if we're in desktop or mobile view on resize
    window.addEventListener('resize', () => {
        const wasDesktopView = isDesktopView;
        
        // Update card dimensions on resize
        updateCardDimensions();
        
        // Dynamically check if all cards fit
        checkCardsVisibility();
        
        // If view type changed, update the UI
        if (wasDesktopView !== isDesktopView) {
            updateNavigation();
        }
        
        // Re-scroll to maintain position after resize
        if (!isDesktopView) {
            scrollToCard(currentIndex, false);
        }
    });
    
    // Function to check if all cards fit in the viewport
    function checkCardsVisibility() {
        const containerWidth = carouselContainer.clientWidth;
        // Re-calculate card width in case it changed
        updateCardDimensions();
        const totalCardsWidth = (cardWidth * cards.length) + (cardGap * (cards.length - 1));
        
        // If all cards fit with some margin, we're in desktop view
        isDesktopView = totalCardsWidth <= containerWidth - 40; // 40px buffer
    }
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
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
            if (isDesktopView || index === currentIndex) {
                card.classList.toggle('flipped');
                
                // In mobile view, ensure only one card is flipped at a time
                if (!isDesktopView && card.classList.contains('flipped')) {
                    unflipAllCardsExcept(index);
                }
            } else if (!isDesktopView && (index === currentIndex - 1 || index === currentIndex + 1)) {
                // If clicking on a partially visible card, navigate to it instead of flipping
                currentIndex = index;
                scrollToCard(currentIndex);
                updateNavigation();
                updateDots(currentIndex);
                unflipAllCardsExcept(currentIndex);
            }
        });
    });
    
    // Scroll event to update dots and navigation
    carousel.addEventListener('scroll', () => {
        if (isDesktopView) return; // No need to handle this in desktop view
        
        const scrollPosition = carousel.scrollLeft;
        const newIndex = Math.round(scrollPosition / (cardWidth + cardGap));
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
            currentIndex = newIndex;
            updateNavigation();
            updateDots(currentIndex);
            unflipAllCardsExcept(currentIndex);
        }
    });
    
    // Touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    let startScrollPosition = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        startScrollPosition = carousel.scrollLeft;
        isSwiping = false; // Reset swiping flag
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        // If horizontal movement is detected, mark as swiping
        if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 10) {
            isSwiping = true;
            
            // Prevent default scrolling behavior for smoother swipes
            if (!isDesktopView) {
                // Calculate how far we've moved
                const moveX = touchStartX - e.changedTouches[0].screenX;
                // Apply the scroll directly for smoother movement
                carousel.scrollLeft = startScrollPosition + moveX;
            }
        }
    }, { passive: false });
    
    carousel.addEventListener('touchend', (e) => {
        if (isDesktopView) return; // No need to handle this in desktop view
        
        touchEndX = e.changedTouches[0].screenX;
        
        // Only handle swipe if we detected swiping motion
        if (isSwiping) {
            handleSwipe();
        }
    }, { passive: true });
    
    function handleSwipe() {
        // Calculate the current card based on scroll position
        const scrollPosition = carousel.scrollLeft;
        const exactIndex = scrollPosition / (cardWidth + cardGap);
        
        // Determine direction of swipe
        const swipeDirection = touchStartX > touchEndX ? 'left' : 'right';
        
        // Calculate the target index based on current position and swipe direction
        let targetIndex;
        if (swipeDirection === 'left' && currentIndex < cards.length - 1) {
            targetIndex = Math.ceil(exactIndex);
        } else if (swipeDirection === 'right' && currentIndex > 0) {
            targetIndex = Math.floor(exactIndex);
        } else {
            // If we can't move in the desired direction, snap to nearest card
            targetIndex = Math.round(exactIndex);
        }
        
        // Ensure target index is within bounds
        targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));
        
        // Only update if we're changing position
        if (targetIndex !== currentIndex) {
            currentIndex = targetIndex;
            scrollToCard(currentIndex);
            updateNavigation();
            updateDots(currentIndex);
            unflipAllCardsExcept(currentIndex);
        } else {
            // If we're not changing cards, ensure we snap back to the current card
            scrollToCard(currentIndex);
        }
    }
    
    // Helper functions
    function scrollToCard(index, smooth = true) {
        if (isDesktopView) return; // No need to scroll in desktop view
        
        // Re-calculate card width in case it changed
        updateCardDimensions();
        const scrollPosition = index * (cardWidth + cardGap);
        carousel.scrollTo({
            left: scrollPosition,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }
    
    function updateDots(index) {
        if (isDesktopView) return; // No need to update dots in desktop view
        
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function updateNavigation() {
        if (isDesktopView) {
            // Hide navigation in desktop view
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            document.querySelector('.dots-container').style.display = 'none';
            
            // Make sure carousel is reset to show all cards
            carousel.scrollLeft = 0;
            return;
        } else {
            // Show navigation in mobile view
            document.querySelector('.dots-container').style.display = 'flex';
            
            // Show/hide prev/next buttons based on position
            prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
            nextBtn.style.display = currentIndex === cards.length - 1 ? 'none' : 'flex';
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
