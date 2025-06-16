/* FAQ Accordion Interactivity */

(function () {
  const faqItems = document.querySelectorAll('.faq-item');

  // Set initial state for already expanded items
  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    if (item.classList.contains('expanded')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      // Collapse any open item except the one clicked (optional; comment if not needed)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('expanded');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current item
      const isExpanded = item.classList.toggle('expanded');
      questionBtn.setAttribute('aria-expanded', isExpanded);
      answer.setAttribute('aria-hidden', !isExpanded);

      // Use scrollHeight for smooth transition
      if (isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
})();
