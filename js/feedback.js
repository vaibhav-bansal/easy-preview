/**
 * Easy Preview - Feedback Form
 * Handles feedback submission to Supabase
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Supabase configuration
const SUPABASE_URL = 'https://mdbqvnnk3inllny8gxoc0q.supabase.co'; // Will be extracted from env or config
const SUPABASE_ANON_KEY = 'sb_publishable_mdbQvNnk3InlLnY8GxOC0Q_EEMkWYd8';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Feedback categories mapping
const FEEDBACK_CATEGORIES = {
  query: 'General Query',
  request: 'Feature Request',
  collaboration: 'Collaboration',
  bug: 'Bug Report'
};

// Placeholder texts for each category
const CATEGORY_PLACEHOLDERS = {
  query: 'Ask us anything or share your thoughts...',
  request: 'Describe the feature you\'d like to see...',
  collaboration: 'Tell us how you\'d like to contribute...',
  bug: 'Describe what\'s not working correctly...'
};

// DOM elements
let feedbackDialog = null;
let feedbackForm = null;
let feedbackNameInput = null;
let feedbackEmailInput = null;
let feedbackRatingInputs = null;
let feedbackCategorySelect = null;
let feedbackMessageTextarea = null;
let submitFeedbackButton = null;
let closeFeedbackButton = null;
let currentRating = 0;

/**
 * Initialize feedback form
 */
async function initFeedback() {
  feedbackDialog = document.getElementById('feedback-dialog');
  feedbackForm = document.getElementById('feedback-form');
  feedbackNameInput = document.getElementById('feedback-name');
  feedbackEmailInput = document.getElementById('feedback-email');
  feedbackCategorySelect = document.getElementById('feedback-category');
  feedbackMessageTextarea = document.getElementById('feedback-message');
  submitFeedbackButton = document.getElementById('submit-feedback-button');
  closeFeedbackButton = document.getElementById('close-feedback-dialog');
  
  const feedbackButton = document.getElementById('feedback-button');
  
  // Setup feedback button
  if (feedbackButton) {
    feedbackButton.disabled = false;
    feedbackButton.addEventListener('click', openFeedbackDialog);
  }
  
  // Setup form
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
  }
  
  // Setup close buttons
  if (closeFeedbackButton) {
    closeFeedbackButton.addEventListener('click', closeFeedbackDialog);
  }
  
  const closeFeedbackButtonBottom = document.getElementById('close-feedback-dialog-bottom');
  if (closeFeedbackButtonBottom) {
    closeFeedbackButtonBottom.addEventListener('click', closeFeedbackDialog);
  }
  
  // Setup category change to update placeholder
  if (feedbackCategorySelect) {
    feedbackCategorySelect.addEventListener('change', updateMessagePlaceholder);
  }
  
  // Setup rating stars
  setupRatingStars();
  
  // Close dialog on outside click
  if (feedbackDialog) {
    feedbackDialog.addEventListener('click', (e) => {
      if (e.target === feedbackDialog) {
        closeFeedbackDialog();
      }
    });
  }
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && feedbackDialog && !feedbackDialog.classList.contains('hidden')) {
      closeFeedbackDialog();
    }
  });
  
  console.log('Feedback form initialized');
}

/**
 * Setup rating stars
 */
function setupRatingStars() {
  const ratingContainer = document.getElementById('feedback-rating');
  if (!ratingContainer) return;
  
  ratingContainer.innerHTML = '';
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'rating-star text-3xl text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer';
    star.innerHTML = '<span class="material-symbols-outlined">star</span>';
    star.dataset.rating = i;
    star.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
    
    star.addEventListener('click', () => selectRating(i));
    star.addEventListener('mouseenter', () => highlightStars(i));
    
    ratingContainer.appendChild(star);
  }
  
  // Reset stars on mouse leave
  ratingContainer.addEventListener('mouseleave', () => {
    updateRatingDisplay(currentRating);
  });
}

/**
 * Select rating
 * @param {number} rating - Rating value (1-5)
 */
function selectRating(rating) {
  currentRating = rating;
  updateRatingDisplay(rating);
  
  // Store in hidden input if exists
  const ratingInput = document.getElementById('feedback-rating-value');
  if (ratingInput) {
    ratingInput.value = rating;
  }
}

/**
 * Highlight stars on hover
 * @param {number} rating - Rating to highlight up to
 */
function highlightStars(rating) {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star, index) => {
    const starValue = index + 1;
    if (starValue <= rating) {
      star.classList.remove('text-gray-400');
      star.classList.add('text-yellow-400');
    } else {
      star.classList.remove('text-yellow-400');
      star.classList.add('text-gray-400');
    }
  });
}

/**
 * Update rating display
 * @param {number} rating - Current rating
 */
function updateRatingDisplay(rating) {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star, index) => {
    const starValue = index + 1;
    if (starValue <= rating) {
      star.classList.remove('text-gray-400');
      star.classList.add('text-yellow-400');
    } else {
      star.classList.remove('text-yellow-400');
      star.classList.add('text-gray-400');
    }
  });
}

/**
 * Update message placeholder based on category
 */
function updateMessagePlaceholder() {
  if (!feedbackCategorySelect || !feedbackMessageTextarea) return;
  
  const category = feedbackCategorySelect.value;
  const placeholder = CATEGORY_PLACEHOLDERS[category] || 'Enter your message...';
  
  feedbackMessageTextarea.placeholder = placeholder;
}

/**
 * Open feedback dialog
 */
function openFeedbackDialog() {
  if (!feedbackDialog) return;
  
  // Reset form
  resetFeedbackForm();
  
  // Show dialog
  feedbackDialog.classList.remove('hidden');
  
  // Focus on name input
  if (feedbackNameInput) {
    setTimeout(() => feedbackNameInput.focus(), 100);
  }
}

/**
 * Close feedback dialog
 */
function closeFeedbackDialog() {
  if (feedbackDialog) {
    feedbackDialog.classList.add('hidden');
  }
  resetFeedbackForm();
}

/**
 * Reset feedback form
 */
function resetFeedbackForm() {
  if (feedbackForm) feedbackForm.reset();
  currentRating = 0;
  updateRatingDisplay(0);
  
  if (feedbackCategorySelect) {
    feedbackCategorySelect.value = 'query'; // Default category
    updateMessagePlaceholder();
  }
}

/**
 * Validate feedback form
 * @returns {Object} {valid: boolean, errors: string[]}
 */
function validateFeedbackForm() {
  const errors = [];
  
  if (!feedbackNameInput?.value?.trim()) {
    errors.push('Full Name is required');
  }
  
  if (!feedbackEmailInput?.value?.trim()) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedbackEmailInput.value.trim())) {
      errors.push('Please enter a valid email address');
    }
  }
  
  if (currentRating === 0) {
    errors.push('Please select a rating');
  }
  
  if (!feedbackCategorySelect?.value) {
    errors.push('Please select a category');
  }
  
  if (!feedbackMessageTextarea?.value?.trim()) {
    errors.push('Message is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Handle feedback form submission
 * @param {Event} e - Submit event
 */
async function handleFeedbackSubmit(e) {
  e.preventDefault();
  
  // Validate form
  const validation = validateFeedbackForm();
  if (!validation.valid) {
    alert(validation.errors.join('\n'));
    return;
  }
  
  // Disable submit button
  if (submitFeedbackButton) {
    submitFeedbackButton.disabled = true;
    submitFeedbackButton.textContent = 'Submitting...';
  }
  
  try {
    // Sign in anonymously (required by RLS policy)
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`);
    }
    
    // Prepare feedback data
    // Note: The current schema doesn't include 'name' and 'email' fields.
    // If you want to store these, you'll need to add columns to your feedback table:
    // ALTER TABLE feedback ADD COLUMN name TEXT;
    // ALTER TABLE feedback ADD COLUMN email TEXT;
    const feedbackData = {
      user_id: authData.user.id,
      rating: currentRating,
      category: feedbackCategorySelect.value,
      message: feedbackMessageTextarea.value.trim()
      // name: feedbackNameInput.value.trim(), // Uncomment if column exists
      // email: feedbackEmailInput.value.trim() // Uncomment if column exists
    };
    
    // Update user metadata with name/email (as a workaround until schema is updated)
    if (feedbackNameInput?.value?.trim() || feedbackEmailInput?.value?.trim()) {
      await supabase.auth.updateUser({
        data: {
          name: feedbackNameInput?.value?.trim() || null,
          email: feedbackEmailInput?.value?.trim() || null
        }
      });
    }
    
    // Insert feedback
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackData])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Submission failed: ${error.message}`);
    }
    
    // Success!
    showFeedbackSuccess();
    
    // Close dialog after delay
    setTimeout(() => {
      closeFeedbackDialog();
    }, 2000);
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    alert(`Failed to submit feedback: ${error.message}\n\nPlease try again or open an issue on GitHub.`);
  } finally {
    // Re-enable submit button
    if (submitFeedbackButton) {
      submitFeedbackButton.disabled = false;
      submitFeedbackButton.textContent = 'Submit Feedback';
    }
  }
}

/**
 * Show feedback success message
 */
function showFeedbackSuccess() {
  const feedbackFormContent = document.getElementById('feedback-form-content');
  if (!feedbackFormContent) return;
  
  feedbackFormContent.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12">
      <span class="material-symbols-outlined text-6xl mb-4 text-green-400">check_circle</span>
      <h3 class="text-xl font-medium mb-2">Thank You!</h3>
      <p class="text-gray-400 text-center">Your feedback has been submitted successfully.</p>
    </div>
  `;
}

export { initFeedback, openFeedbackDialog };

