document.addEventListener('DOMContentLoaded', function() {
    const sectionTitles = document.querySelectorAll('.section-title');
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');

    if (sectionTitles.length === 0 && sectionSubtitles.length === 0) {
        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    });

    sectionTitles.forEach(title => {
        observer.observe(title);
    });
    
    sectionSubtitles.forEach(subtitle => {
        observer.observe(subtitle);
    });
});
