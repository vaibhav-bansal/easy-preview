/**
 * Easy Preview - Share Functionality
 * Generates shareable links and embed code
 */

// DOM elements
let shareDialog = null;
let shareLinkInput = null;
let embedCodeInput = null;
let copyLinkButton = null;
let copyEmbedButton = null;
let closeShareDialogButton = null;
let fullScreenLink = null;

/**
 * Initialize share functionality
 */
function initShare() {
  shareDialog = document.getElementById('share-dialog');
  shareLinkInput = document.getElementById('share-link-input');
  embedCodeInput = document.getElementById('embed-code-input');
  copyLinkButton = document.getElementById('copy-link-button');
  copyEmbedButton = document.getElementById('copy-embed-button');
  closeShareDialogButton = document.getElementById('close-share-dialog');
  fullScreenLink = document.getElementById('fullscreen-link');
  
  const shareButton = document.getElementById('share-button');
  
  if (shareButton) {
    shareButton.disabled = false;
    // Event listener will be set by app.js to avoid circular dependency
  }
  
  if (closeShareDialogButton) {
    closeShareDialogButton.addEventListener('click', closeShareDialog);
  }
  
  if (copyLinkButton) {
    copyLinkButton.addEventListener('click', copyShareLink);
  }
  
  if (copyEmbedButton) {
    copyEmbedButton.addEventListener('click', copyEmbedCode);
  }
  
  // Close dialog on outside click
  if (shareDialog) {
    shareDialog.addEventListener('click', (e) => {
      if (e.target === shareDialog) {
        closeShareDialog();
      }
    });
  }
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareDialog && !shareDialog.classList.contains('hidden')) {
      closeShareDialog();
    }
  });
  
  console.log('Share functionality initialized');
}

/**
 * Generate shareable URL
 * @param {string} url - URL to preview
 * @param {string} device - Device ID
 * @param {number} width - Viewport width
 * @param {number} height - Viewport height
 * @returns {string} Shareable URL
 */
function generateShareUrl(url, device, width, height) {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    url: encodeURIComponent(url),
    device: device,
    w: width.toString(),
    h: height.toString()
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate embed code
 * @param {string} url - URL to preview
 * @param {number} width - Viewport width
 * @param {number} height - Viewport height
 * @returns {string} Embed iframe code
 */
function generateEmbedCode(url, width, height) {
  const shareUrl = window.location.origin + window.location.pathname + '?url=' + encodeURIComponent(url);
  
  return `<iframe src="${shareUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
}

/**
 * Generate full-screen preview URL
 * @param {string} url - URL to preview
 * @param {number} width - Viewport width
 * @param {number} height - Viewport height
 * @returns {string} Full-screen preview URL
 */
function generateFullScreenUrl(url, width, height) {
  // For now, full-screen uses the same URL but could be a separate embed.html page
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    url: encodeURIComponent(url),
    w: width.toString(),
    h: height.toString(),
    embed: 'true'
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Open share dialog
 * @param {Object} state - Current app state {url, device, width, height}
 */
function openShareDialog(state) {
  if (!shareDialog || !state || !state.url) {
    alert('Please load a URL first before sharing');
    return;
  }
  
  // Generate URLs and embed code
  const shareUrl = generateShareUrl(state.url, state.device, state.width, state.height);
  const embedCode = generateEmbedCode(state.url, state.width, state.height);
  const fullScreenUrl = generateFullScreenUrl(state.url, state.width, state.height);
  
  // Update inputs
  if (shareLinkInput) {
    shareLinkInput.value = shareUrl;
  }
  
  if (embedCodeInput) {
    embedCodeInput.value = embedCode;
  }
  
  if (fullScreenLink) {
    fullScreenLink.href = fullScreenUrl;
  }
  
  // Show dialog
  shareDialog.classList.remove('hidden');
  
  // Focus on share link input for easy selection
  if (shareLinkInput) {
    setTimeout(() => shareLinkInput.select(), 100);
  }
}

/**
 * Close share dialog
 */
function closeShareDialog() {
  if (shareDialog) {
    shareDialog.classList.add('hidden');
  }
}

/**
 * Copy share link to clipboard
 */
async function copyShareLink() {
  if (!shareLinkInput) return;
  
  try {
    await navigator.clipboard.writeText(shareLinkInput.value);
    showCopyFeedback(copyLinkButton, 'Copied!');
  } catch (err) {
    // Fallback for older browsers
    shareLinkInput.select();
    document.execCommand('copy');
    showCopyFeedback(copyLinkButton, 'Copied!');
  }
}

/**
 * Copy embed code to clipboard
 */
async function copyEmbedCode() {
  if (!embedCodeInput) return;
  
  try {
    await navigator.clipboard.writeText(embedCodeInput.value);
    showCopyFeedback(copyEmbedButton, 'Copied!');
  } catch (err) {
    // Fallback for older browsers
    embedCodeInput.select();
    document.execCommand('copy');
    showCopyFeedback(copyEmbedButton, 'Copied!');
  }
}

/**
 * Show copy feedback on button
 * @param {HTMLElement} button - Button element
 * @param {string} text - Feedback text
 */
function showCopyFeedback(button, text) {
  if (!button) return;
  
  const originalText = button.textContent;
  button.textContent = text;
  button.classList.add('bg-green-600');
  
  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove('bg-green-600');
  }, 2000);
}

export { initShare, openShareDialog, generateShareUrl, generateEmbedCode };

