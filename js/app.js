/**
 * Easy Preview - Main Application Logic
 */

import { DEVICES, getDeviceById, getDefaultDevice, findDeviceByDimensions } from './devices.js';
import { initResizer } from './resizer.js';
import { initShare, openShareDialog } from './share.js';
import { initFeedback } from './feedback.js';

// State
let currentDevice = getDefaultDevice();
let currentWidth = currentDevice.width;
let currentHeight = currentDevice.height;
let currentUrl = '';

// DOM Elements (will be populated after DOM is ready)
let urlInput, loadButton, deviceSelect, widthInput, heightInput;
let orientationButton, previewFrame, previewContainer, dimensionDisplay;
let previewPlaceholder;

/**
 * Initialize the application
 */
function init() {
  // Get DOM elements
  urlInput = document.getElementById('url-input');
  loadButton = document.getElementById('load-button');
  deviceSelect = document.getElementById('device-select');
  widthInput = document.getElementById('width-input');
  heightInput = document.getElementById('height-input');
  orientationButton = document.getElementById('orientation-button');
  previewFrame = document.getElementById('preview-frame');
  previewContainer = document.getElementById('preview-container');
  dimensionDisplay = document.getElementById('dimension-display');
  previewPlaceholder = document.getElementById('preview-placeholder');
  
  populateDeviceSelect();
  setupEventListeners();
  applyDeviceDimensions(currentDevice);
  parseUrlParameters();
  
  // Initialize resize handles
  initResizer(previewContainer, handleResize);
  
  // Initialize share functionality
  initShare();
  
  // Initialize feedback form
  initFeedback();
  
  console.log('Easy Preview initialized');
}

/**
 * Populate device dropdown with options
 */
function populateDeviceSelect() {
  if (!deviceSelect) return;
  
  deviceSelect.innerHTML = '';
  
  DEVICES.forEach(device => {
    const option = document.createElement('option');
    option.value = device.id;
    
    const displayText = device.id === 'custom' 
      ? device.name 
      : `${device.name} (${device.width}×${device.height})`;
    
    option.textContent = displayText;
    
    if (device.id === currentDevice.id) {
      option.selected = true;
    }
    
    deviceSelect.appendChild(option);
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Load button click
  loadButton?.addEventListener('click', handleLoadUrl);
  
  // URL input enter key
  urlInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLoadUrl();
    }
  });
  
  // Device selection change
  deviceSelect?.addEventListener('change', handleDeviceChange);
  
  // Width input change
  widthInput?.addEventListener('change', handleDimensionChange);
  widthInput?.addEventListener('input', handleDimensionInput);
  
  // Height input change
  heightInput?.addEventListener('change', handleDimensionChange);
  heightInput?.addEventListener('input', handleDimensionInput);
  
  // Orientation toggle
  orientationButton?.addEventListener('click', handleOrientationToggle);
  
  // Share button (handle here to access state)
  const shareButton = document.getElementById('share-button');
  shareButton?.addEventListener('click', handleShareClick);
}

/**
 * Handle URL load
 */
function handleLoadUrl() {
  let url = urlInput?.value?.trim() || '';
  
  if (!url) {
    alert('Please enter a URL');
    urlInput?.focus();
    return;
  }
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
    if (urlInput) urlInput.value = url;
  }
  
  // Basic URL validation
  try {
    new URL(url);
  } catch {
    alert('Please enter a valid URL');
    urlInput?.focus();
    return;
  }
  
  currentUrl = url;
  loadPreview(url);
}

/**
 * Load URL in preview iframe
 * @param {string} url - URL to load
 */
function loadPreview(url) {
  if (!previewFrame) return;
  
  // Show loading state
  if (previewPlaceholder) {
    previewPlaceholder.innerHTML = `
      <span class="material-symbols-outlined text-6xl mb-4 opacity-50 animate-pulse">hourglass_empty</span>
      <p>Loading preview...</p>
    `;
    previewPlaceholder.classList.remove('hidden');
  }
  
  // Reset iframe
  previewFrame.classList.add('hidden');
  
  // Load the URL
  previewFrame.src = url;
  
  let loadTimeout;
  let frameBlocked = false;
  
  // Set a timeout to detect blocked frames (CSP/X-Frame-Options violations)
  loadTimeout = setTimeout(() => {
    // Check if frame content is accessible (blocked frames won't be accessible)
    try {
      const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow?.document;
      // If we can't access the document and onload hasn't fired, it's likely blocked
      if (!frameDoc && previewFrame.classList.contains('hidden')) {
        frameBlocked = true;
        showFrameBlockedError(url);
      }
    } catch (e) {
      // Cross-origin or blocked frame - check if it's actually loaded
      // If onload hasn't fired after timeout, show blocked error
      if (previewFrame.classList.contains('hidden')) {
        frameBlocked = true;
        showFrameBlockedError(url);
      }
    }
  }, 3000); // 3 second timeout
  
  // Show iframe when loaded
  previewFrame.onload = function() {
    clearTimeout(loadTimeout);
    
    // Additional check: detect chrome-error pages or blocked content
    // Note: For cross-origin frames, we can't access location/document due to same-origin policy
    setTimeout(() => {
      try {
        const frameWindow = previewFrame.contentWindow;
        const frameLocation = frameWindow.location.href;
        
        // Check if it's a chrome-error page (indicates blocked frame)
        if (frameLocation.startsWith('chrome-error://') || 
            frameLocation.includes('chromewebdata') ||
            frameLocation === 'about:blank') {
          frameBlocked = true;
          showFrameBlockedError(url);
          return;
        }
      } catch (e) {
        // Cross-origin - can't check location directly
        // Try to detect by checking if we can access any frame properties
        // If it's truly blocked, some browsers will show chrome-error://
        // For legitimate cross-origin sites, onload firing usually means success
        // However, CSP/X-Frame-Options violations might still fire onload
        // So we'll show the iframe and let the user see if there's an error
      }
      
      // Check for common blocked frame indicators in the iframe content (same-origin only)
      try {
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow?.document;
        if (frameDoc) {
          const bodyText = frameDoc.body?.innerText?.toLowerCase() || '';
          const htmlContent = frameDoc.documentElement?.innerHTML?.toLowerCase() || '';
          
          // Check for common error messages
          if (bodyText.includes('refused to connect') || 
              bodyText.includes('x-frame-options') ||
              bodyText.includes('content security policy') ||
              bodyText.includes('frame-ancestors') ||
              htmlContent.includes('refused to connect') ||
              htmlContent.includes('x-frame-options')) {
            frameBlocked = true;
            showFrameBlockedError(url);
            return;
          }
        }
      } catch (e) {
        // Cross-origin - can't check content
      }
      
      // If we got here and it's not blocked, show the frame
      if (!frameBlocked) {
        previewFrame.classList.remove('hidden');
        if (previewPlaceholder) previewPlaceholder.classList.add('hidden');
      }
    }, 100); // Short delay to allow frame to settle
  };
  
  previewFrame.onerror = function() {
    clearTimeout(loadTimeout);
    showGenericError(url);
  };
  
  updatePreviewDimensions();
}

/**
 * Show error message for blocked frames (CSP/X-Frame-Options)
 * @param {string} url - The blocked URL
 */
function showFrameBlockedError(url) {
  if (!previewPlaceholder) return;
  
  previewFrame.classList.add('hidden');
  
  const domain = new URL(url).hostname;
  
  previewPlaceholder.innerHTML = `
    <span class="material-symbols-outlined text-6xl mb-4 opacity-50 text-yellow-400">block</span>
    <p class="text-yellow-400 font-medium mb-2">Cannot preview this website</p>
    <p class="text-gray-400 text-sm mb-4 px-4 text-center">
      ${domain} has security restrictions that prevent it from being displayed in an iframe.<br>
      This is a security feature (CSP/X-Frame-Options) to protect users from clickjacking attacks.
    </p>
    <button 
      onclick="window.open('${url}', '_blank')"
      class="mt-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
      <span class="material-symbols-outlined text-lg">open_in_new</span>
      Open in New Tab
    </button>
  `;
  previewPlaceholder.classList.remove('hidden');
}

/**
 * Show generic error message
 * @param {string} url - The failed URL
 */
function showGenericError(url) {
  if (!previewPlaceholder) return;
  
  previewFrame.classList.add('hidden');
  
  previewPlaceholder.innerHTML = `
    <span class="material-symbols-outlined text-6xl mb-4 opacity-50 text-red-400">error</span>
    <p class="text-red-400 font-medium mb-2">Failed to load URL</p>
    <p class="text-gray-400 text-sm mb-4 px-4 text-center">
      The URL could not be loaded. Please check the URL and try again.
    </p>
    <button 
      onclick="window.open('${url}', '_blank')"
      class="mt-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
      <span class="material-symbols-outlined text-lg">open_in_new</span>
      Open in New Tab
    </button>
  `;
  previewPlaceholder.classList.remove('hidden');
}

/**
 * Handle device selection change
 * @param {Event} e - Change event
 */
function handleDeviceChange(e) {
  const deviceId = e.target.value;
  const device = getDeviceById(deviceId);
  
  if (device) {
    currentDevice = device;
    
    if (device.id !== 'custom') {
      currentWidth = device.width;
      currentHeight = device.height;
      applyDeviceDimensions(device);
    }
  }
}

/**
 * Handle dimension input (live update while typing)
 */
function handleDimensionInput() {
  const width = parseInt(widthInput?.value) || currentWidth;
  const height = parseInt(heightInput?.value) || currentHeight;
  
  updateDimensionDisplay(width, height);
}

/**
 * Handle dimension change (on blur/enter)
 */
function handleDimensionChange() {
  const width = parseInt(widthInput?.value) || 375;
  const height = parseInt(heightInput?.value) || 667;
  
  // Enforce minimum dimensions
  currentWidth = Math.max(200, width);
  currentHeight = Math.max(300, height);
  
  // Update inputs with validated values
  if (widthInput) widthInput.value = currentWidth;
  if (heightInput) heightInput.value = currentHeight;
  
  // Check if dimensions match a preset device
  const matchingDevice = findDeviceByDimensions(currentWidth, currentHeight);
  
  if (matchingDevice) {
    currentDevice = matchingDevice;
    if (deviceSelect) deviceSelect.value = matchingDevice.id;
  } else {
    currentDevice = getDeviceById('custom');
    if (deviceSelect) deviceSelect.value = 'custom';
  }
  
  updatePreviewDimensions();
}

/**
 * Handle orientation toggle (swap width and height)
 */
function handleOrientationToggle() {
  const temp = currentWidth;
  currentWidth = currentHeight;
  currentHeight = temp;
  
  if (widthInput) widthInput.value = currentWidth;
  if (heightInput) heightInput.value = currentHeight;
  
  // Switch to custom if rotated dimensions don't match preset
  const matchingDevice = findDeviceByDimensions(currentWidth, currentHeight);
  
  if (matchingDevice) {
    currentDevice = matchingDevice;
    if (deviceSelect) deviceSelect.value = matchingDevice.id;
  } else {
    currentDevice = getDeviceById('custom');
    if (deviceSelect) deviceSelect.value = 'custom';
  }
  
  updatePreviewDimensions();
}

/**
 * Apply device dimensions to inputs and preview
 * @param {Object} device - Device object
 */
function applyDeviceDimensions(device) {
  currentWidth = device.width;
  currentHeight = device.height;
  
  if (widthInput) widthInput.value = device.width;
  if (heightInput) heightInput.value = device.height;
  
  updatePreviewDimensions();
}

/**
 * Update preview iframe dimensions
 */
function updatePreviewDimensions() {
  if (previewContainer) {
    previewContainer.style.width = `${currentWidth}px`;
    previewContainer.style.height = `${currentHeight}px`;
  }
  
  if (previewFrame) {
    previewFrame.style.width = `${currentWidth}px`;
    previewFrame.style.height = `${currentHeight}px`;
  }
  
  updateDimensionDisplay(currentWidth, currentHeight);
}

/**
 * Update dimension display text
 * @param {number} width 
 * @param {number} height 
 */
function updateDimensionDisplay(width, height) {
  if (dimensionDisplay) {
    dimensionDisplay.textContent = `${width} × ${height}`;
  }
}

/**
 * Handle resize from drag handles
 * @param {number} width - New width
 * @param {number} height - New height
 */
function handleResize(width, height) {
  // Update state
  currentWidth = width;
  currentHeight = height;
  
  // Update input fields
  if (widthInput) widthInput.value = width;
  if (heightInput) heightInput.value = height;
  
  // Check if dimensions match a preset device
  const matchingDevice = findDeviceByDimensions(width, height);
  
  if (matchingDevice) {
    currentDevice = matchingDevice;
    if (deviceSelect) deviceSelect.value = matchingDevice.id;
  } else {
    currentDevice = getDeviceById('custom');
    if (deviceSelect) deviceSelect.value = 'custom';
  }
  
  // Update dimension display
  updateDimensionDisplay(width, height);
}

/**
 * Parse URL parameters for shared links
 */
function parseUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  
  const url = params.get('url');
  const deviceId = params.get('device');
  const width = params.get('w');
  const height = params.get('h');
  
  // Apply URL if present
  if (url && urlInput) {
    urlInput.value = decodeURIComponent(url);
    currentUrl = url;
  }
  
  // Apply device or custom dimensions
  if (deviceId && deviceId !== 'custom') {
    const device = getDeviceById(deviceId);
    if (device) {
      currentDevice = device;
      if (deviceSelect) deviceSelect.value = deviceId;
      applyDeviceDimensions(device);
    }
  } else if (width && height) {
    currentWidth = parseInt(width) || 375;
    currentHeight = parseInt(height) || 667;
    currentDevice = getDeviceById('custom');
    if (deviceSelect) deviceSelect.value = 'custom';
    if (widthInput) widthInput.value = currentWidth;
    if (heightInput) heightInput.value = currentHeight;
    updatePreviewDimensions();
  }
  
  // Load URL if present
  if (url) {
    loadPreview(decodeURIComponent(url));
  }
}

/**
 * Get current state for sharing
 * @returns {Object} Current state
 */
function getCurrentState() {
  return {
    url: currentUrl,
    device: currentDevice.id,
    width: currentWidth,
    height: currentHeight
  };
}

/**
 * Handle share button click
 */
function handleShareClick() {
  const state = getCurrentState();
  openShareDialog(state);
}

// Export for use in other modules
export { getCurrentState, currentWidth, currentHeight, currentUrl, handleShareClick };

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
