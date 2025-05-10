document.addEventListener('DOMContentLoaded', function() {
  const ctaButton = document.querySelector('.cta-button'); // Main CTA button in navbar
  const stickyCta = document.querySelector('.sticky-cta');

  function handleCtaClick() {
    // Original action was alert('CTA clicked!');
    console.log('CTA button clicked!'); 
  }

  if (ctaButton) {
    ctaButton.addEventListener('click', handleCtaClick);
  }

  if (stickyCta) {
    stickyCta.addEventListener('click', handleCtaClick);
    
    // Note: The logic to add/remove the '.visible' class to 'stickyCta' 
    // (e.g., based on scroll) was not present in the provided navbar.js snippet for these buttons.
    // If this functionality is desired, it needs to be implemented here or ensured it exists elsewhere.
    // Example of scroll-based visibility (add if needed):
    /*
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) { // Adjust scroll threshold as needed
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
    */
  }
});
