/**
 * Scrolls an element into the center of the viewport with smooth scrolling
 * @param elementRef Element or selector to scroll to
 * @param offset Optional vertical offset
 */
export const scrollElementToCenter = (
  elementRef: HTMLElement | string | null,
  offset: number = 0
): void => {
  if (!elementRef) return;

  // Wait for next frame to ensure DOM is updated
  setTimeout(() => {
    // Get the element if a string selector was provided
    const element = typeof elementRef === 'string' 
      ? document.querySelector(elementRef) as HTMLElement
      : elementRef;
  
    if (!element) return;
  
    // Calculate element position
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top + window.scrollY;
    const elementCenter = elementTop + elementRect.height / 2;
    
    // Calculate viewport center
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    
    // Calculate where to scroll to center the element in the viewport
    const scrollToY = elementCenter - viewportCenter - offset;
  
    // Perform the scroll - use both methods for better compatibility
    try {
      // Modern approach
      window.scrollTo({
        top: scrollToY,
        behavior: 'smooth'
      });
      
      // For iOS Safari which may have issues with scrollTo behavior
      if (isMobileSafari()) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    } catch (e) {
      // Fallback for older browsers
      window.scrollTo(0, scrollToY);
    }
  }, 50);
};

/**
 * Check if browser is Mobile Safari
 */
function isMobileSafari(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && /WebKit/i.test(ua) && !/CriOS/i.test(ua);
} 