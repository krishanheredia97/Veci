/**
 * Guide Message Component
 * 
 * This component creates and manages a pulsating guide message that appears
 * on top of flipcards to hint at their interactive nature.
 */

class GuideMessage {
    constructor(options = {}) {
        // Default options
        this.options = {
            message: 'Girar carta',
            parentSelector: '.flip-card',
            showDelay: 500,
            ...options
        };
        
        this.elements = [];
        this.isVisible = false;
        this.hasUserInteracted = false;
    }
    
    /**
     * Initialize guide messages for all matching parent elements
     */
    init() {
        const parents = document.querySelectorAll(this.options.parentSelector);
        parents.forEach((parent, index) => {
            // Create the guide message element
            const guideElement = document.createElement('div');
            guideElement.className = 'guide-message';
            
            // Format message with one word per line
            const words = this.options.message.split(' ');
            words.forEach((word, i) => {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word;
                guideElement.appendChild(wordSpan);
                
                // Add line breaks between words
                if (i < words.length - 1) {
                    guideElement.appendChild(document.createElement('br'));
                }
            });
            
            // Add to parent
            parent.appendChild(guideElement);
            
            // Store reference with index
            this.elements.push({
                guide: guideElement,
                parent: parent,
                index: index
            });
            
            // Hide by default
            guideElement.style.display = 'none';
        });
    }
    
    /**
     * Show the guide message for a specific card index
     * @param {number} index - The index of the card to show the guide for
     */
    show(index) {
        // Don't show if user has already interacted
        if (this.hasUserInteracted) return;
        
        // First hide all guide messages
        this.hideAll();
        
        // Then show only the one for the specified index
        const element = this.elements.find(el => el.index === index);
        if (element) {
            element.guide.style.display = 'flex';
            this.isVisible = true;
        }
    }
    
    /**
     * Hide the guide message for a specific card index
     * @param {number} index - The index of the card to hide the guide for
     */
    hide(index) {
        const element = this.elements.find(el => el.index === index);
        if (element) {
            element.guide.style.display = 'none';
        }
    }
    
    /**
     * Hide all guide messages
     */
    hideAll() {
        this.elements.forEach(element => {
            element.guide.style.display = 'none';
        });
        this.isVisible = false;
    }
    
    /**
     * Mark that the user has interacted with a card
     * This will prevent guide messages from showing again
     */
    setUserInteracted() {
        this.hasUserInteracted = true;
        this.hideAll();
    }
    
    /**
     * Toggle the guide message visibility for a specific card
     * @param {number} index - The index of the card to toggle the guide for
     */
    toggle(index) {
        const element = this.elements.find(el => el.index === index);
        if (element) {
            if (element.guide.style.display === 'none' || element.guide.style.display === '') {
                this.show(index);
            } else {
                this.hide(index);
            }
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GuideMessage;
}
