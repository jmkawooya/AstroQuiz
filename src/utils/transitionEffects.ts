export enum TransitionType {
  FADE = 'fade',
  SLIDE = 'slide',
  ZOOM = 'zoom',
  PORTAL = 'portal',
}

interface TransitionOptions {
  type?: TransitionType;
  duration?: number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

/**
 * Performs a transition effect between two elements
 * 
 * @param fromElement The element to transition from
 * @param toElement The element to transition to
 * @param options Transition options
 * @returns Promise that resolves when the transition is complete
 */
export const transition = async (
  fromElement: HTMLElement,
  toElement: HTMLElement,
  options: TransitionOptions = {}
): Promise<void> => {
  const {
    type: _type = TransitionType.FADE,
    duration = 300,
    onUpdate,
    onComplete,
  } = options;

  // Default implementation using CSS transitions
  return new Promise<void>((resolve) => {
    // Set initial styles
    if (fromElement) {
      fromElement.style.transition = `opacity ${duration}ms ease-out`;
      fromElement.style.opacity = '0';
    }
    
    if (toElement) {
      toElement.style.transition = `opacity ${duration}ms ease-in`;
      toElement.style.opacity = '0';
      
      // Force reflow to ensure transition works
      void toElement.offsetWidth;
      
      // Start the transition
      toElement.style.opacity = '1';
    }

    // Simulate progress for the onUpdate callback
    const startTime = performance.now();
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (onUpdate) {
        onUpdate(progress);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (onComplete) {
          onComplete();
        }
        resolve();
      }
    };
    
    if (onUpdate) {
      requestAnimationFrame(animate);
    } else {
      // If no onUpdate, just wait for duration
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
        resolve();
      }, duration);
    }
  });
}; 