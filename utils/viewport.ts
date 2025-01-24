interface SafeAreaInsets {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }
  
  export function calculateSafeAreaInsets(): SafeAreaInsets {
    // Check if running in Facebook in-app browser
    const isFacebookApp = navigator.userAgent.includes('FBAN') || 
                         navigator.userAgent.includes('FBAV');
  
    // Get real viewport dimensions
    const win = window;
    const doc = document.documentElement;
  
    const windowHeight = win.innerHeight || doc.clientHeight;
    const windowWidth = win.innerWidth || doc.clientWidth;
  
    const bodyHeight = document.body.offsetHeight;
    const bodyWidth = document.body.offsetWidth;
  
    // For Facebook in-app browser, use minimal safe areas
    if (isFacebookApp) {
      return {
        top: 0,
        bottom: 20, // minimal safe bottom area
        left: 0,
        right: 0
      };
    }
  
    return {
      top: windowHeight - bodyHeight,
      bottom: Math.max(windowHeight - bodyHeight - (windowHeight - bodyHeight), 0),
      left: windowWidth - bodyWidth,
      right: Math.max(windowWidth - bodyWidth - (windowWidth - bodyWidth), 0),
    };
  }
  
  export function applyViewportAdjustments() {
    // Add meta viewport tag if it doesn't exist
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
      document.head.appendChild(meta);
    }
  
    // Wait for DOM to be fully loaded
    const adjustViewport = () => {
      const insets = calculateSafeAreaInsets();
      
      // Apply safe area insets
      document.body.style.paddingTop = `${insets.top}px`;
      document.body.style.paddingBottom = `${insets.bottom}px`;
      document.body.style.paddingLeft = `${insets.left}px`;
      document.body.style.paddingRight = `${insets.right}px`;
  
      // Calculate real viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
  
    // Initial adjustment
    adjustViewport();
  
    // Recheck after a short delay (helps with some in-app browsers)
    setTimeout(adjustViewport, 300);
  }
  
  // Debounce function to limit how often a function is called
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Call this function to set up event listeners
  export function initViewportHandler() {
    // Wait for DOM content to be loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyViewportAdjustments);
    } else {
      applyViewportAdjustments();
    }
    
    const debouncedAdjust = debounce(applyViewportAdjustments, 250);
  
    // Add multiple event listeners for better compatibility
    window.addEventListener('resize', debouncedAdjust);
    window.addEventListener('orientationchange', debouncedAdjust);
    window.addEventListener('load', debouncedAdjust);
    
    // Special handling for in-app browsers
    document.addEventListener('visibilitychange', debouncedAdjust);
  }