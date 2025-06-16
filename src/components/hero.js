/* Enhanced feature badge cycling with faster transitions */
function cycleFeatures() {
    const features = document.querySelectorAll('.feature-text');
    if (features.length === 0) return;
    
    let activeIndex = [...features].findIndex((f) => f.classList.contains('active'));
    
    // Remove active class to start the fade out
    if (activeIndex > -1) {
        features[activeIndex].classList.remove('active');
    }
    
    // Calculate next index
    activeIndex = (activeIndex + 1) % features.length;
    
    // Add active class to next feature after a short delay
    setTimeout(() => {
        if (features[activeIndex]) {
            features[activeIndex].classList.add('active');
        }
    }, 250); // Matches the faster transition duration
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.feature-container')) {
        setTimeout(() => {
            setInterval(cycleFeatures, 2000); // Show each text for 2 seconds
        }, 1000);
    }
});
