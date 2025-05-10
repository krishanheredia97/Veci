document.addEventListener('DOMContentLoaded', function() {
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');

    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      navLinks.classList.remove('open');
    }
  });

  // Toggle mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  menuToggle.addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('open');
  });
});