/**
 * Easy Preview - Theme Management
 * Supports: System, Dark, Light modes
 */

// Theme options
const THEMES = {
  SYSTEM: 'system',
  DARK: 'dark',
  LIGHT: 'light'
};

// Theme labels
const THEME_LABELS = {
  [THEMES.SYSTEM]: 'System Theme',
  [THEMES.DARK]: 'Dark Mode',
  [THEMES.LIGHT]: 'Light Mode'
};

// Storage key
const STORAGE_KEY = 'easy-preview-theme';

// Current theme state
let currentTheme = THEMES.SYSTEM;

/**
 * Get the stored theme preference
 * @returns {string} Theme preference
 */
function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || THEMES.SYSTEM;
  } catch {
    return THEMES.SYSTEM;
  }
}

/**
 * Store theme preference
 * @param {string} theme - Theme to store
 */
function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    console.warn('Could not save theme preference');
  }
}

/**
 * Check if system prefers dark mode
 * @returns {boolean}
 */
function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply theme to the document
 * @param {string} theme - Theme to apply
 */
function applyTheme(theme) {
  const html = document.documentElement;
  const body = document.body;
  
  // Determine actual theme (resolve 'system' to dark/light)
  let effectiveTheme = theme;
  if (theme === THEMES.SYSTEM) {
    effectiveTheme = systemPrefersDark() ? THEMES.DARK : THEMES.LIGHT;
  }
  
  // Remove existing theme classes
  html.classList.remove('dark', 'light');
  body.classList.remove('theme-dark', 'theme-light');
  
  // Apply theme
  if (effectiveTheme === THEMES.DARK) {
    html.classList.add('dark');
    body.classList.add('theme-dark');
    applyDarkStyles();
  } else {
    html.classList.add('light');
    body.classList.add('theme-light');
    applyLightStyles();
  }
  
  // Update button icon and title
  updateThemeButton(theme);
  
  currentTheme = theme;
}

/**
 * Apply dark mode styles
 */
function applyDarkStyles() {
  document.body.style.backgroundColor = '#121212';
  document.body.style.color = '#ffffff';
  
  // Update input and select elements
  document.querySelectorAll('input, select').forEach(el => {
    el.style.backgroundColor = '#2d2d2d';
    el.style.borderColor = '#4a4a4a';
    el.style.color = '#ffffff';
  });
  
  // Update header and toolbar
  document.querySelectorAll('header, .toolbar-section').forEach(el => {
    el.style.backgroundColor = '#1e1e1e';
    el.style.borderColor = '#374151';
  });
  
  // Update toolbar
  const toolbar = document.querySelector('.flex.flex-wrap.items-center.gap-4');
  if (toolbar) {
    toolbar.style.backgroundColor = '#1e1e1e';
  }
  
  // Update preview container
  const previewContainer = document.getElementById('preview-container');
  if (previewContainer) {
    previewContainer.style.backgroundColor = '#2d2d2d';
    previewContainer.style.borderColor = '#4a4a4a';
  }
}

/**
 * Apply light mode styles
 */
function applyLightStyles() {
  document.body.style.backgroundColor = '#f5f5f5';
  document.body.style.color = '#1a1a1a';
  
  // Update input and select elements
  document.querySelectorAll('input, select').forEach(el => {
    el.style.backgroundColor = '#ffffff';
    el.style.borderColor = '#d1d5db';
    el.style.color = '#1a1a1a';
  });
  
  // Update header
  const header = document.querySelector('header');
  if (header) {
    header.style.backgroundColor = '#ffffff';
    header.style.borderColor = '#e5e7eb';
    header.style.color = '#1a1a1a';
  }
  
  // Update toolbar
  const toolbar = document.querySelector('.flex.flex-wrap.items-center.gap-4');
  if (toolbar) {
    toolbar.style.backgroundColor = '#ffffff';
    toolbar.style.borderColor = '#e5e7eb';
  }
  
  // Update preview container
  const previewContainer = document.getElementById('preview-container');
  if (previewContainer) {
    previewContainer.style.backgroundColor = '#e5e7eb';
    previewContainer.style.borderColor = '#d1d5db';
  }
  
  // Update text colors
  document.querySelectorAll('.text-white').forEach(el => {
    if (!el.closest('button') && !el.closest('a')) {
      el.style.color = '#1a1a1a';
    }
  });
  
  document.querySelectorAll('.text-gray-400').forEach(el => {
    el.style.color = '#6b7280';
  });
  
  // Update header title
  const h1 = document.querySelector('h1');
  if (h1) h1.style.color = '#1a1a1a';
  
  // Update dimension display
  const dimensionDisplay = document.getElementById('dimension-display');
  if (dimensionDisplay) dimensionDisplay.style.color = '#6b7280';
  
  // Update icon buttons
  document.querySelectorAll('.btn-icon').forEach(el => {
    el.style.color = '#374151';
  });
  
  // Keep primary button styled
  const loadButton = document.getElementById('load-button');
  if (loadButton) {
    loadButton.style.color = '#ffffff';
  }
}

/**
 * Update theme toggle button icon and title
 * @param {string} theme - Current theme
 */
function updateThemeButton(theme) {
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  
  // Theme icon SVGs
  const themeIcons = {
    [THEMES.SYSTEM]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2v20M12 2a10 10 0 0 1 10 10M12 2a10 10 0 0 0-10 10"/>
    </svg>`,
    [THEMES.DARK]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`,
    [THEMES.LIGHT]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`
  };
  
  // Replace the icon (remove any existing SVG or span, add new SVG)
  const existingIcon = button.querySelector('svg');
  if (existingIcon) {
    existingIcon.outerHTML = themeIcons[theme] || themeIcons[THEMES.SYSTEM];
  } else {
    // Fallback: if no SVG exists, create one
    button.innerHTML = themeIcons[theme] || themeIcons[THEMES.SYSTEM];
  }
  
  button.title = THEME_LABELS[theme];
  button.setAttribute('aria-label', THEME_LABELS[theme]);
}

/**
 * Cycle to next theme
 * @returns {string} New theme
 */
function cycleTheme() {
  const order = [THEMES.SYSTEM, THEMES.DARK, THEMES.LIGHT];
  const currentIndex = order.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % order.length;
  return order[nextIndex];
}

/**
 * Handle theme toggle click
 */
function handleThemeToggle() {
  const newTheme = cycleTheme();
  storeTheme(newTheme);
  applyTheme(newTheme);
  
  console.log(`Theme changed to: ${THEME_LABELS[newTheme]}`);
}

/**
 * Initialize theme system
 */
function initTheme() {
  // Get stored preference
  currentTheme = getStoredTheme();
  
  // Apply initial theme
  applyTheme(currentTheme);
  
  // Setup toggle button
  const themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    themeButton.disabled = false;
    themeButton.addEventListener('click', handleThemeToggle);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === THEMES.SYSTEM) {
      applyTheme(THEMES.SYSTEM);
    }
  });
  
  console.log('Theme system initialized:', THEME_LABELS[currentTheme]);
}

// Export
export { initTheme, THEMES, currentTheme };

