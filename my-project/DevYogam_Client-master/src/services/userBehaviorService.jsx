/**
 * User Behavior Tracking Service
 * This service tracks user actions on the website and sends them to the backend
 * Includes UTM parameter capture and social media source detection
 */

// Get or generate session ID
function getSessionId() {
  let sessionId = sessionStorage.getItem('behavior_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('behavior_session_id', sessionId);
  }
  return sessionId;
}

// Get user ID if logged in
function getUserId() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user._id || null;
}

// Capture UTM parameters from URL and store them
function captureUTMParameters() {
  // Check if UTM params are already captured for this session
  const storedUTM = sessionStorage.getItem('utm_params_captured');
  if (storedUTM) {
    return JSON.parse(storedUTM);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    utmSource: urlParams.get('utm_source') || null,
    utmMedium: urlParams.get('utm_medium') || null,
    utmCampaign: urlParams.get('utm_campaign') || null,
    utmTerm: urlParams.get('utm_term') || null,
    utmContent: urlParams.get('utm_content') || null,
  };

  // Store in sessionStorage if any UTM param exists
  if (utmParams.utmSource || utmParams.utmMedium || utmParams.utmCampaign) {
    sessionStorage.setItem('utm_params_captured', JSON.stringify(utmParams));
  }

  return utmParams;
}

// Detect social media platform from referrer and UTM source
function detectSocialPlatform(referrer, utmSource) {
  // First check UTM source (explicit tracking)
  if (utmSource) {
    const source = utmSource.toLowerCase();
    if (source.includes('facebook') || source.includes('fb')) return 'facebook';
    if (source.includes('instagram') || source.includes('ig')) return 'instagram';
    if (source.includes('whatsapp') || source.includes('wa')) return 'whatsapp';
    if (source.includes('google') || source.includes('gclid')) return 'google';
    if (source.includes('twitter') || source.includes('x.com')) return 'twitter';
    if (source.includes('linkedin')) return 'linkedin';
    if (source.includes('youtube') || source.includes('yt')) return 'youtube';
    if (source.includes('tiktok')) return 'tiktok';
    if (source === 'direct' || source === '(none)') return 'direct';
    return source;
  }

  // Then check referrer
  if (!referrer) return 'direct';

  const ref = referrer.toLowerCase();

  // Google and other search engines
  if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo') || ref.includes('duckduckgo')) {
    return 'organic';
  }

  // Social media platforms
  if (ref.includes('facebook.com') || ref.includes('fb.com')) return 'facebook';
  if (ref.includes('instagram.com')) return 'instagram';
  if (ref.includes('wa.me') || ref.includes('whatsapp.com')) return 'whatsapp';
  if (ref.includes('twitter.com') || ref.includes('x.com')) return 'twitter';
  if (ref.includes('linkedin.com')) return 'linkedin';
  if (ref.includes('youtube.com')) return 'youtube';
  if (ref.includes('tiktok.com')) return 'tiktok';

  // If referrer is from same domain, it's direct
  const currentDomain = window.location.hostname;
  if (!ref.includes(currentDomain)) {
    return 'referral';
  }

  return 'direct';
}

// Get client info including UTM and social platform
function getClientInfo() {
  const referrer = document.referrer || '';
  const utmParams = captureUTMParameters();
  const socialPlatform = detectSocialPlatform(referrer, utmParams.utmSource);

  return {
    userAgent: navigator.userAgent,
    ipAddress: '', // Will be captured server-side
    referrer,
    ...utmParams,
    socialPlatform,
  };
}

/**
 * Track a single behavior
 * @param {string} action - The type of action (page_view, click, scroll, form_submit, etc.)
 * @param {string} page - The current page URL or path
 * @param {Object} additionalData - Additional data like element, value, duration, metadata
 */
async function trackBehavior(action, page, additionalData = {}) {
  const sessionId = getSessionId();
  const userId = getUserId();
  const clientInfo = getClientInfo();

  // Get entry page from session storage (set on first page view)
  let entryPage = sessionStorage.getItem('entry_page');
  if (!entryPage && action === 'page_view') {
    entryPage = page;
    sessionStorage.setItem('entry_page', page);
  }

  const behaviorData = {
    sessionId,
    userId,
    action,
    page,
    entryPage,
    ...additionalData,
    ...clientInfo,
    timestamp: new Date().toISOString(),
  };

  try {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    await fetch(`${API_URL}/api/behavior/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(behaviorData),
    });
  } catch (error) {
    console.error('Error tracking behavior:', error);
  }
}

/**
 * Track multiple behaviors at once (batch)
 * @param {Array} behaviors - Array of behavior objects
 */
async function trackBehaviors(behaviors) {
  const sessionId = getSessionId();
  const userId = getUserId();
  const clientInfo = getClientInfo();

  const behaviorsWithMeta = behaviors.map(behavior => ({
    sessionId,
    userId,
    ...clientInfo,
    timestamp: new Date().toISOString(),
    ...behavior,
  }));

  try {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    await fetch(`${API_URL}/api/behavior/track-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ behaviors: behaviorsWithMeta }),
    });
  } catch (error) {
    console.error('Error tracking behaviors:', error);
  }
}

/**
 * Track page view
 * @param {string} page - The page path (optional, defaults to current path)
 * @param {number} duration - Time spent on page in milliseconds
 */
function trackPageView(page = window.location.pathname, duration = 0) {
  return trackBehavior('page_view', page, { duration });
}

/**
 * Track click events
 * @param {string} element - The element that was clicked
 * @param {string} value - Optional value associated with the click
 * @param {string} page - The page where click happened
 */
function trackClick(element, value = '', page = window.location.pathname) {
  return trackBehavior('click', page, { element, value });
}

/**
 * Track form submissions
 * @param {string} formName - The name/ID of the form
 * @param {boolean} isStart - Whether this is form start (true) or submit (false)
 * @param {string} page - The page where form is located
 */
function trackForm(formName, isStart = false, page = window.location.pathname) {
  const action = isStart ? 'form_start' : 'form_submit';
  return trackBehavior(action, page, { element: formName });
}

/**
 * Track scroll depth
 * @param {number} depth - Scroll depth percentage (0-100)
 * @param {string} page - The page where scroll happened
 */
function trackScroll(depth, page = window.location.pathname) {
  return trackBehavior('scroll', page, { value: String(depth) });
}

/**
 * Track time spent on page
 * @param {number} duration - Time spent in milliseconds
 * @param {string} page - The page where time was spent
 */
function trackTimeSpent(duration, page = window.location.pathname) {
  return trackBehavior('time_spent', page, { duration });
}

/**
 * Track exit/leave events
 * @param {string} page - The page being exited
 */
function trackExit(page = window.location.pathname) {
  return trackBehavior('exit', page);
}

/**
 * Track custom events
 * @param {string} eventName - Name of the custom event
 * @param {Object} metadata - Additional metadata
 * @param {string} page - The page where event occurred
 */
function trackCustomEvent(eventName, metadata = {}, page = window.location.pathname) {
  return trackBehavior('custom', page, { element: eventName, metadata });
}

/**
 * Track WhatsApp clicks
 * @param {string} phoneNumber - The WhatsApp number clicked
 * @param {string} page - The page where click happened
 */
function trackWhatsAppClick(phoneNumber = '', page = window.location.pathname) {
  return trackBehavior('whatsapp_click', page, { 
    element: 'whatsapp_button',
    value: phoneNumber,
    metadata: { phoneNumber }
  });
}

/**
 * Track phone calls
 * @param {string} phoneNumber - The phone number clicked
 * @param {string} page - The page where click happened
 */
function trackPhoneClick(phoneNumber = '', page = window.location.pathname) {
  return trackBehavior('phone_click', page, { 
    element: 'phone_button',
    value: phoneNumber,
    metadata: { phoneNumber }
  });
}

/**
 * Track booking/conversion events
 * @param {Object} bookingData - Data about the booking
 * @param {string} page - The page where booking happened
 */
function trackBooking(bookingData = {}, page = window.location.pathname) {
  return trackBehavior('booking', page, { metadata: bookingData });
}

/**
 * Get current tracking info (for debugging/display)
 */
function getTrackingInfo() {
  const clientInfo = getClientInfo();
  return {
    sessionId: getSessionId(),
    userId: getUserId(),
    ...clientInfo,
  };
}

export {
  trackBehavior,
  trackBehaviors,
  trackPageView,
  trackClick,
  trackForm,
  trackScroll,
  trackTimeSpent,
  trackExit,
  trackCustomEvent,
  trackWhatsAppClick,
  trackPhoneClick,
  trackBooking,
  getSessionId,
  getTrackingInfo,
  captureUTMParameters,
};

export default {
  trackBehavior,
  trackBehaviors,
  trackPageView,
  trackClick,
  trackForm,
  trackScroll,
  trackTimeSpent,
  trackExit,
  trackCustomEvent,
  trackWhatsAppClick,
  trackPhoneClick,
  trackBooking,
  getSessionId,
  getTrackingInfo,
  captureUTMParameters,
};
