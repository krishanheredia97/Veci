// JavaScript for the pricing page
document.addEventListener('DOMContentLoaded', function() {
    // You can add any interactive functionality for the pricing page here
    // For example, toggle features, handle button clicks, etc.
    
    const ctaButtons = document.querySelectorAll('.pricing-card-cta .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // You can add analytics tracking or other functionality here
            console.log('Pricing CTA clicked:', this.textContent.trim());
            
            // If the button is not an actual link (doesn't have href)
            if (!this.getAttribute('href')) {
                e.preventDefault();
                // You could show a modal, form, or other UI element here
            }
        });
    });
});
