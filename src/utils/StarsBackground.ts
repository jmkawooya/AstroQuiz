/**
 * Creates a randomly distributed starfield background with twinkling animations
 */
export function createStarsBackground(): void {
  // First remove any existing stars container to avoid duplicates
  const existingContainer = document.querySelector('.stars-container');
  if (existingContainer) {
    document.body.removeChild(existingContainer);
  }

  const starsContainer = document.createElement('div');
  starsContainer.className = 'stars-container';
  
  // Add specific styling to ensure visibility on mobile browsers
  starsContainer.style.position = 'fixed';
  starsContainer.style.top = '0';
  starsContainer.style.left = '0';
  starsContainer.style.width = '100%';
  starsContainer.style.height = '100%';
  starsContainer.style.zIndex = '0';
  starsContainer.style.pointerEvents = 'none';
  
  document.body.appendChild(starsContainer);
  
  // Configuration
  const numberOfStars = 300; // Total stars to create
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const appearanceWindow = 8; // Stars will start appearing over this many seconds
  
  // Create stars with random positions and properties
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('span');
    
    // Random position
    const x = Math.floor(Math.random() * viewportWidth);
    const y = Math.floor(Math.random() * viewportHeight);
    
    // Random size
    const sizeClass = getRandomFromArray(['small', 'medium', 'large'], [70, 25, 5]);
    
    // Random animation
    const animClass = getRandomFromArray(['twinkle-1', 'twinkle-2', 'twinkle-3'], [40, 40, 20]);
    
    // Create staggered initial appearance
    // Earlier stars (lower index) appear sooner than later stars for a gradual fill effect
    // Mix in some randomness so it's not strictly sequential
    const initialDelay = (i / numberOfStars) * appearanceWindow * (0.7 + Math.random() * 0.3);
    
    // Set properties
    star.className = `star ${sizeClass} ${animClass}`;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.animationDelay = `${initialDelay}s`;
    
    // Add to container
    starsContainer.appendChild(star);
  }
}

/**
 * Helper function to get a random element from an array based on weighted probabilities
 * @param {Array<T>} array - Array of items to choose from
 * @param {Array<number>} weights - Array of weights (percentages) for each item
 * @returns {T} - Random element from the array
 */
function getRandomFromArray<T>(array: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < array.length; i++) {
    if (random < weights[i]) {
      return array[i];
    }
    random -= weights[i];
  }
  
  return array[0]; // Fallback
}

/**
 * Handle window resize by recreating the stars
 */
function handleResize(): void {
  // Remove existing stars
  const container = document.querySelector('.stars-container');
  if (container) {
    document.body.removeChild(container);
  }
  
  // Recreate stars
  createStarsBackground();
}

// Add window resize listener with debounce
let resizeTimer: number;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(handleResize, 250);
}); 