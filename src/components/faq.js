/* FAQ Accordion Interactivity */

(function () {
  const faqItems = document.querySelectorAll('.faq-item');

  // Set initial state for already expanded items
  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    
    if (item.classList.contains('expanded')) {
      // Set a large enough value to ensure content is fully visible
      answer.style.maxHeight = '1000px';
      // Icon rotation is handled by CSS
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
          
          // Icon rotation is handled by CSS
        }
      });

      // Toggle current item
      const isExpanded = item.classList.toggle('expanded');
      questionBtn.setAttribute('aria-expanded', isExpanded);
      answer.setAttribute('aria-hidden', !isExpanded);

      // Update content height based on state
      if (isExpanded) {
        // Set a large enough value to ensure content is fully visible
        answer.style.maxHeight = '1000px';
        
        // Add a small delay to ensure transition works smoothly
        setTimeout(() => {
          // Recalculate actual height after expansion for smoother animation
          answer.style.maxHeight = Math.max(answer.scrollHeight, 300) + 'px';
        }, 10);
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });
})();
