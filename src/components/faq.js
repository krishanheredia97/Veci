/* FAQ Accordion Interactivity */

(function () {
  const faqItems = document.querySelectorAll('.faq-item');

  // Set initial state for already expanded items
  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.icon');
    
    if (item.classList.contains('expanded')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      // Set up arrow for expanded items
      if (icon) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      }
    } else {
      // Set down arrow for collapsed items
      if (icon) {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      }
    }
  });

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    let icon = questionBtn.querySelector('.icon');

    // Ensure arrow icon is present
    if (!icon) {
      icon = document.createElement('i');
      icon.classList.add('icon', 'fas', 'fa-chevron-down');
      icon.setAttribute('aria-hidden', 'true');
      questionBtn.appendChild(icon);
    }

    questionBtn.addEventListener('click', () => {
      // Collapse any open item except the one clicked
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('expanded');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
          
          // Update arrow for collapsed items
          const otherIcon = otherItem.querySelector('.icon');
          if (otherIcon) {
            otherIcon.classList.remove('fa-chevron-up');
            otherIcon.classList.add('fa-chevron-down');
          }
        }
      });

      // Toggle current item
      const isExpanded = item.classList.toggle('expanded');
      questionBtn.setAttribute('aria-expanded', isExpanded);
      answer.setAttribute('aria-hidden', !isExpanded);

      // Update arrow based on state
      if (isExpanded) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        answer.style.maxHeight = null;
      }
    });
  });
})();
