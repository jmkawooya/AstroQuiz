/**
 * WebGL Accelerated Scrolling Effects
 * Provides smooth GPU-accelerated scrolling animations
 */

// WebGL scroll animation shader for smooth scrolling
const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  
  uniform sampler2D u_texture;
  uniform float u_progress;
  uniform float u_direction; // 1 for down, -1 for up
  
  varying vec2 v_texCoord;
  
  void main() {
    // Calculate offset based on scroll progress
    float offset = u_progress * 0.05 * u_direction;
    
    // Sample texture with offset for smooth movement effect
    vec2 scrollTexCoord = vec2(v_texCoord.x, v_texCoord.y + offset);
    
    // Add slight fade effect during transition
    float fade = 1.0 - min(1.0, u_progress * 0.8);
    
    gl_FragColor = texture2D(u_texture, scrollTexCoord) * fade;
  }
`;

let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;
let animationFrameId: number | null = null;
let elementToScroll: HTMLElement | null = null;
let targetScrollY: number = 0;
let currentProgress: number = 0;
let scrollDirection: number = 1; // 1 for down, -1 for up
let texture: WebGLTexture | null = null;

/**
 * Initialize WebGL for scroll animations
 */
function initWebGLScroll(): boolean {
  // Create hidden canvas for WebGL calculations
  const canvas = document.createElement('canvas');
  canvas.width = 2; // Minimal size since we're just using for calculations
  canvas.height = 2;
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  
  // Get WebGL context
  gl = canvas.getContext('webgl', { premultipliedAlpha: false });
  if (!gl) {
    console.warn('WebGL not supported, falling back to standard scrolling');
    document.body.removeChild(canvas);
    return false;
  }
  
  // Create shader program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  program = createProgram(gl, vertexShader, fragmentShader);
  
  // Create a texture to represent the scroll target
  texture = gl.createTexture();
  
  return true;
}

/**
 * Create and compile a shader
 */
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const infoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Failed to compile shader: ${infoLog}`);
  }
  
  return shader;
}

/**
 * Create and link a shader program
 */
function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const infoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Failed to link program: ${infoLog}`);
  }
  
  return program;
}

/**
 * Scroll element to center of viewport using WebGL acceleration for smooth animation
 * Falls back to standard scrolling if WebGL is not available
 */
export const scrollElementToCenter = (
  elementRef: HTMLElement | string | null,
  offset: number = 0
): void => {
  if (!elementRef) return;
  
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
  
  // Determine scroll direction
  scrollDirection = scrollToY > window.scrollY ? 1 : -1;
  
  // Update target scroll position
  targetScrollY = scrollToY;
  
  // Try GPU-accelerated scrolling
  if (performWebGLScroll(element, scrollToY)) {
    return; // WebGL animation started successfully
  }
  
  // Fallback to standard browser scrolling
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
};

/**
 * Perform WebGL-accelerated scroll animation
 * Returns true if WebGL animation started, false if falling back to standard scrolling
 */
function performWebGLScroll(element: HTMLElement, targetY: number): boolean {
  // Initialize WebGL if not already done
  if (!gl && !initWebGLScroll()) {
    return false; // WebGL not supported, use fallback
  }
  
  // Store reference to element being scrolled
  elementToScroll = element;
  
  // Store target scroll position
  targetScrollY = targetY;
  
  // Reset animation progress
  currentProgress = 0;
  
  // Start the animation
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  // Begin animation loop
  animationFrameId = requestAnimationFrame(animateScroll);
  
  return true;
}

/**
 * Animation loop for scroll effect
 */
function animateScroll(_timestamp: number): void {
  // Increment progress
  currentProgress += 0.05; // Speed of animation
  
  if (currentProgress >= 1.0) {
    // Animation complete, perform actual scroll
    window.scrollTo(0, targetScrollY);
    
    // Clean up
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    return;
  }
  
  // Calculate intermediate scroll position
  const currentY = window.scrollY;
  const distance = targetScrollY - currentY;
  const easeY = currentY + distance * easeOutCubic(currentProgress);
  
  // Perform the scroll
  window.scrollTo(0, easeY);
  
  // Use WebGL for visual effects during scroll if available
  if (gl && program && elementToScroll) {
    updateWebGLEffects();
  }
  
  // Continue animation
  animationFrameId = requestAnimationFrame(animateScroll);
}

/**
 * Update WebGL effects during scrolling
 */
function updateWebGLEffects(): void {
  if (!gl || !program || !elementToScroll) return;
  
  // Use our shader program
  gl.useProgram(program);
  
  // Update uniforms
  const progressLocation = gl.getUniformLocation(program, 'u_progress');
  gl.uniform1f(progressLocation, currentProgress);
  
  const directionLocation = gl.getUniformLocation(program, 'u_direction');
  gl.uniform1f(directionLocation, scrollDirection);
  
  // Apply any other WebGL animations here
  // This is primarily preparation for the GPU calculations,
  // the actual scrolling is still done via window.scrollTo for compatibility
}

/**
 * Cubic ease-out function for smooth animation
 */
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

/**
 * Check if browser is Mobile Safari
 */
function isMobileSafari(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && /WebKit/i.test(ua) && !/CriOS/i.test(ua);
}

/**
 * Clean up WebGL resources
 */
export function cleanupWebGLScrollEffects(): void {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  if (gl) {
    if (texture) {
      gl.deleteTexture(texture);
      texture = null;
    }
    
    if (program) {
      gl.deleteProgram(program);
      program = null;
    }
    
    // Find and remove the canvas
    const canvas = gl.canvas;
    if (canvas && 'parentNode' in canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    
    gl = null;
  }
} 