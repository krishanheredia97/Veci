document.addEventListener('DOMContentLoaded', function() {
  // Set the countdown date - July 15, 2025
  const countdownDate = new Date('July 15, 2025 00:00:00').getTime();
  
  // Elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const waitlistBtn = document.getElementById('waitlist-btn');
  
  // Previous values for animation
  let prevDays, prevHours, prevMinutes, prevSeconds;
  
  // Update countdown every second
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;
    
    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Add leading zeros
    const formattedDays = String(days).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    // Update HTML
    daysEl.textContent = formattedDays;
    hoursEl.textContent = formattedHours;
    minutesEl.textContent = formattedMinutes;
    secondsEl.textContent = formattedSeconds;
    
    // Only add animation to days when it changes
    if (prevDays !== formattedDays) {
      addPulseAnimation(daysEl);
      prevDays = formattedDays;
    }
    
    // Just update the values without animation
    if (prevHours !== formattedHours) {
      prevHours = formattedHours;
    }
    
    if (prevMinutes !== formattedMinutes) {
      prevMinutes = formattedMinutes;
    }
    
    if (prevSeconds !== formattedSeconds) {
      prevSeconds = formattedSeconds;
    }
    
    // If countdown is over
    if (distance < 0) {
      clearInterval(countdownInterval);
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      
      // Change the title to indicate launch
      document.querySelector('.countdown-title').textContent = '¡Ya lanzamos!';
    }
  }
  
  // Add pulse animation
  function addPulseAnimation(element) {
    element.classList.remove('pulse');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('pulse');
  }
  
  // Initial call
  updateCountdown();
  
  // Update every second
  const countdownInterval = setInterval(updateCountdown, 1000);
  
  // No click handler for the waitlist button as requested
  // You'll add that functionality later
});
