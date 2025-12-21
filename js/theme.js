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

// Theme icons
const THEME_ICONS = {
  [THEMES.SYSTEM]: 'contrast',
  [THEMES.DARK]: 'dark_mode',
  [THEMES.LIGHT]: 'light_mode'
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
  
  const icon = button.querySelector('.material-symbols-outlined');
  if (icon) {
    icon.textContent = THEME_ICONS[theme];
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

