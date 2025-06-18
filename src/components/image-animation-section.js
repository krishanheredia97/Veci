/**
 * Image container animation for bottom CTA section
 * This script handles the cycling animation of images in the bottom CTA section
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if the element exists and is in viewport or has been scrolled to
    function initImageAnimation() {
        const bottomCta = document.getElementById('bottom-cta');
        if (!bottomCta) return;
        
        const bottomImages = document.querySelectorAll('#bottom-cta .image-container img');
        if (!bottomImages.length) return;

        let currentIndex = 0;
        const totalImages = bottomImages.length;

        function cycle() {
            // Remove all active classes
            bottomImages.forEach(img => {
                img.classList.remove('active', 'last-active');
            });
            
            // Move to next image
            currentIndex = (currentIndex + 1) % totalImages;
            
            // Add appropriate class based on position
            if (currentIndex === totalImages - 1) {
                bottomImages[currentIndex].classList.add('active', 'last-active');
            } else {
                bottomImages[currentIndex].classList.add('active');
            }
            
            // Set appropriate delay based on which frame is showing
            const delay = (currentIndex === totalImages - 1) ? 4000 : 1000;
            setTimeout(cycle, delay);
        }

        setTimeout(cycle, 500);
    }

    // Check if element is in viewport or has been scrolled to
    function isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Initialize animation when FAQ section is visible
    function checkAndInitialize() {
        const faqSection = document.getElementById('faq');
        const bottomCta = document.getElementById('bottom-cta');
        
        if (faqSection && bottomCta && isElementInViewport(faqSection)) {
            initImageAnimation();
            window.removeEventListener('scroll', checkAndInitialize);
        }
    }

    // Check on initial load and on scroll
    checkAndInitialize();
    window.addEventListener('scroll', checkAndInitialize);
});
