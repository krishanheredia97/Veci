document.addEventListener('DOMContentLoaded', function() {
  // Select all buttons with our standardized classes
  const ctaButtons = document.querySelectorAll('.cta-button');
  const primaryButtons = document.querySelectorAll('.btn.btn-primary');
  const stickyCta = document.querySelector('.sticky-cta');

  function handleButtonClick(e) {
    // Prevent default if it's a link and we want custom behavior
    // e.preventDefault();
    console.log('Button clicked:', e.currentTarget.className);
    
    // Add any custom behavior here
  }

  // Add event listeners to all CTA buttons
  if (ctaButtons.length > 0) {
    ctaButtons.forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });
  }

  // Add event listeners to all primary buttons
  if (primaryButtons.length > 0) {
    primaryButtons.forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });
  }

  // Handle sticky CTA if present
  if (stickyCta) {
    stickyCta.addEventListener('click', handleButtonClick);
    
    // Add scroll behavior for sticky CTA
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) { // Show after scrolling down 300px
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
  }
});
