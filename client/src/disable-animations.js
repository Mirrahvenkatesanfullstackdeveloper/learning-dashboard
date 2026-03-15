// This runs before anything else and kills all animations
(function killAllAnimations() {
  // Disable all CSS transitions and animations
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      animation: none !important;
      transition: none !important;
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `;
  document.head.appendChild(style);
  
  // Override requestAnimationFrame to do nothing
  window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 0);
  };
  
  // Disable all event listeners that might cause re-renders
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'scroll' || type === 'resize' || type === 'animationstart') {
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
})();