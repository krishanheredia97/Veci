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
    updateNavigation();     // This will determine if dots need to be updated and call updateDots internally
    if (!isDesktopView && !(carousel.scrollWidth <= carousel.clientWidth + 1)) {
        scrollToCard(currentIndex, false); // Ensure initial card is correctly positioned if in carousel mode
    }
    
    // Check if we're in desktop or mobile view on resize
    window.addEventListener('resize', () => {
        // const wasDesktopView = isDesktopView; // Keep this if specific actions are needed on view *change*
        
        updateCardGap();
        updateCardDimensions();
        checkCardsVisibility(); 
        updateNavigation(); // Always update navigation to reflect new state
        
        // Re-scroll to maintain position after resize if in carousel mode and scrollable
        if (!isDesktopView && (carousel.scrollWidth > carousel.clientWidth + 1)) {
            scrollToCard(currentIndex, false);
        }
    });
    
    // Function to check if we're in desktop or mobile view
    function checkCardsVisibility() {
        // Check if we're in landscape mode and minimum width for desktop view
        isDesktopView = window.matchMedia('(min-width: 768px) and (orientation: landscape)').matches;
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
            // Allow swipe to scroll and snap visually, but do not update currentIndex or dots.
            // The active state (currentIndex, dots) is only changed by buttons/dots.
            const scrollPosition = carousel.scrollLeft;
            // Calculate which card index the current scroll position is closest to
            const nearestVisualIndex = Math.round(scrollPosition / (cardWidth + cardGap));
            
            // Snap to that card visually. Check if already snapped to avoid redundant scroll.
            const targetScrollPosition = nearestVisualIndex * (cardWidth + cardGap);
            if(Math.abs(carousel.scrollLeft - targetScrollPosition) > 1) { // Small tolerance
                carousel.scrollTo({
                    left: targetScrollPosition,
                    behavior: 'smooth'
                });
            }
            // NOTE: currentIndex, updateNavigation(), updateDots() are NOT called here.
        }
        // isSwiping is reset in 'touchstart'
    }, { passive: true });
    
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
