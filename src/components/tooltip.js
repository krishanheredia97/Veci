/**
 * Tooltip functionality
 * Initializes tooltips and handles their behavior
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    initTooltips();
});

/**
 * Initialize all tooltips on the page
 */
function initTooltips() {
    // For mobile devices, add tap functionality
    if (window.innerWidth < 768) {
        setupMobileTooltips();
    }
}

/**
 * Setup special handling for tooltips on mobile devices
 * On mobile, we want to toggle the tooltip on tap rather than hover
 */
function setupMobileTooltips() {
    const tooltipContainers = document.querySelectorAll('.tooltip-container');
    
    tooltipContainers.forEach(container => {
        const trigger = container.querySelector('.tooltip-trigger');
        const content = container.querySelector('.tooltip-content');
        
        if (trigger && content) {
            // Toggle tooltip visibility on tap
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle active class
                const isVisible = container.classList.contains('active');
                
                // Close all other open tooltips
                document.querySelectorAll('.tooltip-container.active').forEach(el => {
                    if (el !== container) {
                        el.classList.remove('active');
                    }
                });
                
                // Toggle current tooltip
                if (isVisible) {
                    container.classList.remove('active');
                } else {
                    container.classList.add('active');
                }
            });
            
            // Close tooltip when clicking outside
            document.addEventListener('click', () => {
                container.classList.remove('active');
            });
        }
    });
}

/**
 * Create a tooltip element and attach it to a target element
 * @param {HTMLElement} targetElement - Element to attach tooltip to
 * @param {string} tooltipText - Text content for the tooltip
 */
function createTooltip(targetElement, tooltipText) {
    const tooltipContainer = document.createElement('span');
    tooltipContainer.className = 'tooltip-container';
    
    const tooltipTrigger = document.createElement('span');
    tooltipTrigger.className = 'tooltip-trigger';
    tooltipTrigger.textContent = '?';
    
    const tooltipContent = document.createElement('span');
    tooltipContent.className = 'tooltip-content';
    tooltipContent.textContent = tooltipText;
    
    tooltipContainer.appendChild(tooltipTrigger);
    tooltipContainer.appendChild(tooltipContent);
    
    targetElement.appendChild(tooltipContainer);
    
    return tooltipContainer;
}
