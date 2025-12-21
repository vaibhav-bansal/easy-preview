/**
 * Easy Preview - Draggable Resize Handles
 * Allows users to drag edges/corners to resize the viewport
 */

// Minimum dimensions
const MIN_WIDTH = 200;
const MIN_HEIGHT = 300;

// Resize handle types
const HANDLE_TYPES = {
  RIGHT: 'right',
  BOTTOM: 'bottom',
  BOTTOM_RIGHT: 'bottom-right',
  LEFT: 'left',
  TOP: 'top',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left'
};

let isResizing = false;
let currentHandle = null;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let startLeft = 0;
let startTop = 0;

// Callbacks (set by app.js)
let onResizeCallback = null;
let previewContainer = null;

/**
 * Create a resize handle element
 * @param {string} type - Handle type (e.g., 'right', 'bottom-right')
 * @returns {HTMLElement} Handle element
 */
function createHandle(type) {
  const handle = document.createElement('div');
  handle.className = `resize-handle resize-handle-${type}`;
  handle.dataset.handle = type;
  handle.setAttribute('aria-label', `Resize ${type}`);
  
  return handle;
}

/**
 * Initialize resize handles on the preview container
 * @param {HTMLElement} container - Preview container element
 * @param {Function} callback - Callback function(width, height) when resize happens
 */
function initResizer(container, callback) {
  previewContainer = container;
  onResizeCallback = callback;
  
  if (!container) return;
  
  // Make container position relative for absolute positioned handles
  container.style.position = 'relative';
  
  // Create handles for all edges and corners
  const handles = [
    HANDLE_TYPES.RIGHT,
    HANDLE_TYPES.BOTTOM,
    HANDLE_TYPES.BOTTOM_RIGHT,
    HANDLE_TYPES.LEFT,
    HANDLE_TYPES.TOP,
    HANDLE_TYPES.TOP_LEFT,
    HANDLE_TYPES.TOP_RIGHT,
    HANDLE_TYPES.BOTTOM_LEFT
  ];
  
  handles.forEach(type => {
    const handle = createHandle(type);
    container.appendChild(handle);
    
    // Add event listeners
    handle.addEventListener('mousedown', (e) => handleMouseDown(e, type));
  });
  
  // Add global mouse events
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // Prevent text selection while resizing
  document.addEventListener('selectstart', preventSelection);
  
  console.log('Resize handles initialized');
}

/**
 * Prevent text selection during resize
 */
function preventSelection(e) {
  if (isResizing) {
    e.preventDefault();
    return false;
  }
}

/**
 * Handle mouse down on resize handle
 * @param {Event} e - Mouse event
 * @param {string} type - Handle type
 */
function handleMouseDown(e, type) {
  e.preventDefault();
  e.stopPropagation();
  
  if (!previewContainer) return;
  
  isResizing = true;
  currentHandle = type;
  
  // Get initial positions and dimensions
  const rect = previewContainer.getBoundingClientRect();
  startX = e.clientX;
  startY = e.clientY;
  startWidth = rect.width;
  startHeight = rect.height;
  startLeft = rect.left;
  startTop = rect.top;
  
  // Add active class for visual feedback
  document.body.style.cursor = getCursor(type);
  previewContainer.classList.add('resizing');
  
  // Add class to handle
  const handle = e.target;
  handle.classList.add('active');
}

/**
 * Get cursor style for handle type
 * @param {string} type - Handle type
 * @returns {string} Cursor CSS value
 */
function getCursor(type) {
  const cursors = {
    [HANDLE_TYPES.RIGHT]: 'ew-resize',
    [HANDLE_TYPES.LEFT]: 'ew-resize',
    [HANDLE_TYPES.TOP]: 'ns-resize',
    [HANDLE_TYPES.BOTTOM]: 'ns-resize',
    [HANDLE_TYPES.TOP_LEFT]: 'nwse-resize',
    [HANDLE_TYPES.TOP_RIGHT]: 'nesw-resize',
    [HANDLE_TYPES.BOTTOM_LEFT]: 'nesw-resize',
    [HANDLE_TYPES.BOTTOM_RIGHT]: 'nwse-resize'
  };
  return cursors[type] || 'default';
}

/**
 * Handle mouse move during resize
 * @param {Event} e - Mouse event
 */
function handleMouseMove(e) {
  if (!isResizing || !currentHandle || !previewContainer) return;
  
  e.preventDefault();
  
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  
  let newWidth = startWidth;
  let newHeight = startHeight;
  
  // Calculate new dimensions based on handle type
  switch (currentHandle) {
    case HANDLE_TYPES.RIGHT:
      newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
      break;
      
    case HANDLE_TYPES.LEFT:
      newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
      break;
      
    case HANDLE_TYPES.BOTTOM:
      newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
      break;
      
    case HANDLE_TYPES.TOP:
      newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
      break;
      
    case HANDLE_TYPES.BOTTOM_RIGHT:
      newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
      newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
      break;
      
    case HANDLE_TYPES.TOP_LEFT:
      newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
      newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
      break;
      
    case HANDLE_TYPES.TOP_RIGHT:
      newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
      newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
      break;
      
    case HANDLE_TYPES.BOTTOM_LEFT:
      newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
      newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
      break;
  }
  
  // Update dimensions immediately (live preview)
  previewContainer.style.width = `${newWidth}px`;
  previewContainer.style.height = `${newHeight}px`;
  
  // Update iframe dimensions
  const iframe = previewContainer.querySelector('#preview-frame');
  if (iframe) {
    iframe.style.width = `${newWidth}px`;
    iframe.style.height = `${newHeight}px`;
  }
  
  // Call callback with new dimensions (rounded to integers)
  if (onResizeCallback) {
    onResizeCallback(Math.round(newWidth), Math.round(newHeight));
  }
}

/**
 * Handle mouse up - end resize
 * @param {Event} e - Mouse event
 */
function handleMouseUp(e) {
  if (!isResizing) return;
  
  isResizing = false;
  
  // Reset cursor and classes
  document.body.style.cursor = '';
  if (previewContainer) {
    previewContainer.classList.remove('resizing');
  }
  
  // Remove active class from all handles
  document.querySelectorAll('.resize-handle').forEach(handle => {
    handle.classList.remove('active');
  });
  
  currentHandle = null;
}

/**
 * Cleanup resize handlers
 */
function cleanup() {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('selectstart', preventSelection);
}

export { initResizer, cleanup };

