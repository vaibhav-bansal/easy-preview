/**
 * Easy Preview - Main Application Logic
 */

import { DEVICES, getDeviceById, getDefaultDevice, findDeviceByDimensions } from './devices.js';

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
  }
  
  // Load the URL
  previewFrame.src = url;
  
  // Show iframe when loaded
  previewFrame.onload = function() {
    previewFrame.classList.remove('hidden');
    if (previewPlaceholder) previewPlaceholder.classList.add('hidden');
  };
  
  previewFrame.onerror = function() {
    if (previewPlaceholder) {
      previewPlaceholder.innerHTML = `
        <span class="material-symbols-outlined text-6xl mb-4 opacity-50 text-red-400">error</span>
        <p class="text-red-400">Failed to load URL</p>
      `;
      previewPlaceholder.classList.remove('hidden');
    }
    previewFrame.classList.add('hidden');
  };
  
  updatePreviewDimensions();
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

// Export for use in other modules
export { getCurrentState, currentWidth, currentHeight, currentUrl };

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
