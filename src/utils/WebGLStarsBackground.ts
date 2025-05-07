/**
 * WebGLStarsBackground.ts
 * GPU-accelerated twinkling stars background using WebGL
 */

// Vertex shader - positions stars and passes size/twinkle data to fragment shader
const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute float a_twinkleSpeed;
  attribute float a_twinkleOffset;
  attribute float a_alpha;

  uniform float u_time;
  uniform vec2 u_resolution;

  varying float v_brightness;
  varying float v_alpha;

  void main() {
    // Convert position from pixels to clip space (-1 to 1)
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    
    // Flip y-coordinate (WebGL has (0,0) at bottom left)
    gl_Position = vec4(clipSpace.x, -clipSpace.y, 0, 1);
    
    // Calculate star size based on attribute (in pixels)
    gl_PointSize = a_size;
    
    // Simpler twinkling calculation with fewer operations
    float twinkle = sin((u_time * a_twinkleSpeed) + a_twinkleOffset) * 0.5 + 0.5;
    v_brightness = twinkle; // Range from 0.0 to 1.0
    
    // Pass alpha to fragment shader
    v_alpha = a_alpha;
  }
`;

// Fragment shader - renders each star with a soft glow and varying brightness
const FRAGMENT_SHADER = `
  precision mediump float;
  
  uniform vec3 u_color;

  varying float v_brightness;
  varying float v_alpha;

  void main() {
    // Simplified distance calculation - more GPU efficient
    float dist = length(gl_PointCoord - 0.5);
    
    // Enhanced glow effect with stronger falloff for larger stars
    float alpha = max(0.0, 0.5 - dist) * 3.0 * v_alpha;
    
    // Apply brightness with stronger effect
    vec3 color = u_color * (0.35 + 0.65 * v_brightness); 
    
    // Output final color with alpha
    gl_FragColor = vec4(color, alpha);
  }
`;

// Number of stars to render based on device type
const STAR_COUNT = {
  desktop: 250, // Reduced from 300
  mobile: 150   // Even fewer stars for mobile
};

// Target frame rate (in FPS)
const TARGET_FPS = 24; // Lower frame rate to reduce GPU usage
const FRAME_INTERVAL = 1000 / TARGET_FPS;

// Add frame timing tracking
let lastFrameTime = 0;
let isTabActive = true;
let isScrolling = false;
let scrollTimer: number;

// Interface for star parameters
interface Star {
  x: number;
  y: number;
  xNorm: number; // Normalized x (0-1) for position preservation during resize
  yNorm: number; // Normalized y (0-1) for position preservation during resize
  size: number; 
  twinkleSpeed: number;
  twinkleOffset: number;
  alpha: number;
}

// Type for theme-dependent colors
interface StarColors {
  primary: [number, number, number]; // RGB values (0-1)
}

// Hold references to WebGL objects
interface WebGLResources {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffers: {
    position: WebGLBuffer;
    size: WebGLBuffer;
    twinkleSpeed: WebGLBuffer;
    twinkleOffset: WebGLBuffer;
    alpha: WebGLBuffer;
  };
  locations: {
    position: number;
    size: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    alpha: number;
    time: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
    color: WebGLUniformLocation | null;
  };
  stars: Star[];
  startTime: number;
  animationFrame: number;
  needsUpdate: boolean; // Track if buffers need updating
}

// Global resources for the WebGL context and objects
let resources: WebGLResources | null = null;

// Default star colors (can be updated with current theme)
const starColors: StarColors = {
  primary: [1.0, 1.0, 1.0], // White
};

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
 * Create and link a program with vertex and fragment shaders
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

// Get appropriate star count based on device
function getStarCount(): number {
  return window.innerWidth < 768 ? STAR_COUNT.mobile : STAR_COUNT.desktop;
}

/**
 * Generate random stars data
 */
function generateStars(width: number, height: number, count?: number): Star[] {
  const stars: Star[] = [];
  const starCount = count || getStarCount();
  
  for (let i = 0; i < starCount; i++) {
    // Random position - use normalized coordinates (0-1) for easier scaling later
    const xNorm = Math.random(); // Normalized x (0-1)
    const yNorm = Math.random(); // Normalized y (0-1)
    
    // Convert to actual pixel coordinates
    const x = xNorm * width;
    const y = yNorm * height;
    
    // Random size: small (70%), medium (25%), large (5%)
    // Sizes increased further for more visible stars
    let size: number;
    const sizeRand = Math.random() * 100;
    if (sizeRand < 70) {
      size = 3.0 + Math.random() * 2.5; // Small: 3.0-5.5 pixels (increased)
    } else if (sizeRand < 95) {
      size = 5.5 + Math.random() * 4.0; // Medium: 5.5-9.5 pixels (increased)
    } else {
      size = 9.5 + Math.random() * 5.5; // Large: 9.5-15.0 pixels (increased)
    }
    
    // Random twinkle speed - increased for faster twinkling
    const speedOptions = [1.4, 2.0, 3.0]; // Doubled speeds: Fast, faster, fastest
    const twinkleSpeed = speedOptions[Math.floor(Math.random() * speedOptions.length)];
    
    // Random offset to prevent all stars from twinkling in sync
    const twinkleOffset = Math.random() * Math.PI * 2; // 0 to 2π
    
    // Random base alpha (brightness)
    // Bright stars (0.8-1.0) are less common than dim stars (0.3-0.8)
    const alpha = 0.3 + Math.random() * (Math.random() < 0.3 ? 0.7 : 0.5);
    
    stars.push({
      x, y, 
      xNorm, yNorm, // Store normalized coordinates for resizing
      size, twinkleSpeed, twinkleOffset, alpha
    });
  }
  
  return stars;
}

/**
 * Create and setup WebGL buffers with star data
 */
function setupBuffers(
  gl: WebGLRenderingContext, 
  program: WebGLProgram, 
  stars: Star[]
): { 
  buffers: WebGLResources['buffers']; 
  position: number;
  size: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  alpha: number;
  time: WebGLUniformLocation | null;
  resolution: WebGLUniformLocation | null;
  color: WebGLUniformLocation | null;
} {
  // Create buffers
  const positionBuffer = gl.createBuffer();
  const sizeBuffer = gl.createBuffer();
  const twinkleSpeedBuffer = gl.createBuffer();
  const twinkleOffsetBuffer = gl.createBuffer();
  const alphaBuffer = gl.createBuffer();
  
  if (!positionBuffer || !sizeBuffer || !twinkleSpeedBuffer || !twinkleOffsetBuffer || !alphaBuffer) {
    throw new Error('Failed to create buffers');
  }
  
  // Get attribute locations
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const sizeLocation = gl.getAttribLocation(program, 'a_size');
  const twinkleSpeedLocation = gl.getAttribLocation(program, 'a_twinkleSpeed');
  const twinkleOffsetLocation = gl.getAttribLocation(program, 'a_twinkleOffset');
  const alphaLocation = gl.getAttribLocation(program, 'a_alpha');
  
  // Get uniform locations
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const colorLocation = gl.getUniformLocation(program, 'u_color');
  
  // Fill position buffer
  const positions = new Float32Array(stars.length * 2);
  stars.forEach((star, i) => {
    positions[i * 2] = star.x;
    positions[i * 2 + 1] = star.y;
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  
  // Fill size buffer
  const sizes = new Float32Array(stars.map(star => star.size));
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  
  // Fill twinkle speed buffer
  const twinkleSpeeds = new Float32Array(stars.map(star => star.twinkleSpeed));
  gl.bindBuffer(gl.ARRAY_BUFFER, twinkleSpeedBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, twinkleSpeeds, gl.STATIC_DRAW);
  
  // Fill twinkle offset buffer
  const twinkleOffsets = new Float32Array(stars.map(star => star.twinkleOffset));
  gl.bindBuffer(gl.ARRAY_BUFFER, twinkleOffsetBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, twinkleOffsets, gl.STATIC_DRAW);
  
  // Fill alpha buffer
  const alphas = new Float32Array(stars.map(star => star.alpha));
  gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.STATIC_DRAW);
  
  return {
    // Buffers
    buffers: {
      position: positionBuffer,
      size: sizeBuffer,
      twinkleSpeed: twinkleSpeedBuffer,
      twinkleOffset: twinkleOffsetBuffer,
      alpha: alphaBuffer
    },
    // Attribute/uniform locations
    position: positionLocation,
    size: sizeLocation,
    twinkleSpeed: twinkleSpeedLocation,
    twinkleOffset: twinkleOffsetLocation,
    alpha: alphaLocation,
    time: timeLocation,
    resolution: resolutionLocation,
    color: colorLocation
  };
}

/**
 * Main render function that draws the stars
 */
function render(timestamp: number) {
  if (!resources) return;
  
  // Don't render at full framerate if tab is inactive or scrolling
  if (!isTabActive) {
    resources.animationFrame = requestAnimationFrame(render);
    return;
  }
  
  // Throttle frame rate (more aggressive throttling during scrolling)
  const elapsed = timestamp - lastFrameTime;
  const currentInterval = isScrolling ? FRAME_INTERVAL * 3 : FRAME_INTERVAL; // 3x slower during scrolling
  
  if (elapsed < currentInterval) {
    // Skip this frame to maintain target FPS
    resources.animationFrame = requestAnimationFrame(render);
    return;
  }
  
  lastFrameTime = timestamp - (elapsed % currentInterval);
  
  const { gl, program, buffers, locations, stars, startTime } = resources;
  
  // Clear and setup
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // Use our shader program
  gl.useProgram(program);
  
  // Only update uniforms that change
  const currentTime = (performance.now() - startTime) / 1000; // Time in seconds
  gl.uniform1f(locations.time, currentTime);
  
  // Set up position attribute
  gl.enableVertexAttribArray(locations.position);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);
  
  // Set up size attribute
  gl.enableVertexAttribArray(locations.size);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.size);
  gl.vertexAttribPointer(locations.size, 1, gl.FLOAT, false, 0, 0);
  
  // Set up twinkle speed attribute
  gl.enableVertexAttribArray(locations.twinkleSpeed);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.twinkleSpeed);
  gl.vertexAttribPointer(locations.twinkleSpeed, 1, gl.FLOAT, false, 0, 0);
  
  // Set up twinkle offset attribute
  gl.enableVertexAttribArray(locations.twinkleOffset);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.twinkleOffset);
  gl.vertexAttribPointer(locations.twinkleOffset, 1, gl.FLOAT, false, 0, 0);
  
  // Set up alpha attribute
  gl.enableVertexAttribArray(locations.alpha);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.alpha);
  gl.vertexAttribPointer(locations.alpha, 1, gl.FLOAT, false, 0, 0);
  
  // Draw the points
  gl.drawArrays(gl.POINTS, 0, stars.length);
  
  // Schedule the next frame
  resources.animationFrame = requestAnimationFrame(render);
}

/**
 * Handle visibility change to pause rendering when tab is inactive
 */
function handleVisibilityChange() {
  isTabActive = document.visibilityState === 'visible';
  
  // If becoming active again, reset the frame time to avoid big jumps
  if (isTabActive && resources) {
    lastFrameTime = 0;
  }
}

/**
 * Handle window resize by recreating or resizing the canvas
 */
function handleResize() {
  if (!resources) return;
  
  const { canvas, gl } = resources;
  
  // Only update if size actually changed
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  const newWidthPx = newWidth * pixelRatio;
  const newHeightPx = newHeight * pixelRatio;
  
  if (canvas.width === newWidthPx && canvas.height === newHeightPx) {
    return; // No change in size, skip update
  }
  
  // Update canvas dimensions
  canvas.width = newWidthPx;
  canvas.height = newHeightPx;
  
  // Update display size
  canvas.style.width = newWidth + 'px';
  canvas.style.height = newHeight + 'px';
  
  // Update star positions based on normalized coordinates to preserve their relative positions
  // instead of regenerating them
  resources.stars.forEach(star => {
    star.x = star.xNorm * canvas.width;
    star.y = star.yNorm * canvas.height;
  });
  
  // Update only the position buffer with new positions
  updateStarPositions(gl, resources.buffers.position, resources.stars);
  
  // Update resolution uniform
  gl.useProgram(resources.program);
  gl.uniform2f(resources.locations.resolution, canvas.width, canvas.height);
  
  // Redraw with new size
  gl.viewport(0, 0, canvas.width, canvas.height);
}

/**
 * Update only the position buffer after resize
 */
function updateStarPositions(gl: WebGLRenderingContext, positionBuffer: WebGLBuffer, stars: Star[]): void {
  // Fill position buffer with updated positions
  const positions = new Float32Array(stars.length * 2);
  stars.forEach((star, i) => {
    positions[i * 2] = star.x;
    positions[i * 2 + 1] = star.y;
  });
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

/**
 * Handle scroll events to reduce rendering during scrolling
 */
function handleScroll() {
  isScrolling = true;
  
  // Clear the existing timer
  clearTimeout(scrollTimer);
  
  // Set a timeout to indicate when scrolling has stopped
  scrollTimer = window.setTimeout(() => {
    isScrolling = false;
    
    // Force a reset of the frame time to avoid jumps
    if (isTabActive) {
      lastFrameTime = 0;
    }
  }, 150);
}

/**
 * Creates a GPU-accelerated star background using WebGL
 */
export function createWebGLStarsBackground(): void {
  // First remove any existing WebGL stars container
  const existingContainer = document.querySelector('.webgl-stars-container');
  if (existingContainer) {
    document.body.removeChild(existingContainer);
  }
  
  // Create container and canvas
  const container = document.createElement('div');
  container.className = 'webgl-stars-container';
  
  // Style the container
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '0';
  container.style.pointerEvents = 'none';
  
  const canvas = document.createElement('canvas');
  
  // Get device pixel ratio but cap it to reduce GPU load on high-DPI devices
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  
  // Set canvas size accounting for device pixel ratio
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  
  // Set display size
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  canvas.style.display = 'block';
  
  container.appendChild(canvas);
  document.body.appendChild(container);
  
  try {
    // Initialize WebGL context
    const gl = canvas.getContext('webgl', { 
      alpha: true,
      premultipliedAlpha: true,
      antialias: false, // Disable antialiasing to improve performance
      powerPreference: 'low-power' // Prefer energy efficiency over performance
    });
    
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    
    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Set clear color (transparent)
    gl.clearColor(0, 0, 0, 0);
    
    // Create and compile shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    
    // Create and link program
    const program = createProgram(gl, vertexShader, fragmentShader);
    
    // Generate star data
    const stars = generateStars(canvas.width, canvas.height);
    
    // Setup buffers and get attribute locations
    const { buffers, ...locations } = setupBuffers(gl, program, stars);
    
    // Store all resources
    resources = {
      canvas,
      gl,
      program,
      buffers,
      locations,
      stars,
      startTime: performance.now(),
      animationFrame: 0,
      needsUpdate: false
    };
    
    // Set initial uniform values that don't change every frame
    gl.useProgram(program);
    gl.uniform2f(locations.resolution, canvas.width, canvas.height);
    gl.uniform3fv(locations.color, starColors.primary);
    
    // Add visibility change listener to reduce power usage when tab is not visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add scroll listener to reduce rendering during scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize the last frame time
    lastFrameTime = 0;
    
    // Start rendering
    render(0);
    
    // Add resize handler with debounce
    let resizeTimer: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(handleResize, 250);
    });
    
  } catch (error) {
    console.error('Error creating WebGL stars background:', error);
    // In a production app, you might want to handle this error gracefully
    // For this implementation, we'll let it fail since we don't want fallbacks
  }
}

/**
 * Updates star colors based on theme
 * @param color RGB array with values from 0-1
 */
export function updateStarColors(color: [number, number, number]): void {
  if (resources) {
    starColors.primary = color;
    
    // Update color uniform directly
    const { gl, program, locations } = resources;
    gl.useProgram(program);
    gl.uniform3fv(locations.color, starColors.primary);
  }
}

/**
 * Cleans up WebGL resources
 */
export function cleanupWebGLStarsBackground(): void {
  if (!resources) return;
  
  // Stop animation
  cancelAnimationFrame(resources.animationFrame);
  
  // Remove event listeners
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('scroll', handleScroll);
  
  // Remove the canvas from DOM
  const container = document.querySelector('.webgl-stars-container');
  if (container) {
    document.body.removeChild(container);
  }
  
  // Clean up WebGL resources
  const { gl, program, buffers } = resources;
  
  gl.deleteBuffer(buffers.position);
  gl.deleteBuffer(buffers.size);
  gl.deleteBuffer(buffers.twinkleSpeed);
  gl.deleteBuffer(buffers.twinkleOffset);
  gl.deleteBuffer(buffers.alpha);
  gl.deleteProgram(program);
  
  // Clear resources
  resources = null;
} 