/**
 * UTM Parameter Capture Utility
 * This utility captures UTM parameters from the URL and stores them in sessionStorage
 * to track which social media/source the user came from.
 */

// UTM parameter keys
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

/**
 * Get UTM parameters from current URL
 * @returns {Object} UTM parameters object
 */
export function getUtmParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmData = {};
  
  UTM_PARAMS.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      utmData[param] = value;
    }
  });
  
  return utmData;
}

/**
 * Store UTM parameters in session storage
 */
export function storeUtmParams() {
  const utmData = getUtmParams();
  
  if (Object.keys(utmData).length > 0) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmData));
    return utmData;
  }
  
  // Check if UTM params already stored
  const stored = sessionStorage.getItem('utm_params');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Get stored UTM parameters
 * @returns {Object|null} Stored UTM parameters
 */
export function getStoredUtmParams() {
  const stored = sessionStorage.getItem('utm_params');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Clear UTM parameters from session storage
 */
export function clearUtmParams() {
  sessionStorage.removeItem('utm_params');
}

/**
 * Get UTM parameters to send with tracking requests
 * @returns {Object} UTM parameters formatted for the API
 */
export function getUtmForTracking() {
  const utmData = getStoredUtmParams() || getUtmParams();
  
  if (!utmData) return {};
  
  return {
    utmSource: utmData.utm_source || utmData.utmSource,
    utmMedium: utmData.utm_medium || utmData.utmMedium,
    utmCampaign: utmData.utm_campaign || utmData.utmCampaign,
    utmTerm: utmData.utm_term || utmData.utmTerm,
    utmContent: utmData.utm_content || utmData.utmContent,
  };
}

/**
 * Initialize UTM tracking on page load
 * Call this in your App.jsx or index.js
 */
export function initUtmTracking() {
  // Store UTM params from URL on first visit
  storeUtmParams();
  
  // Listen for URL changes (for SPAs)
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      // Check for new UTM params on URL change
      const newUtm = getUtmParams();
      if (Object.keys(newUtm).length > 0) {
        sessionStorage.setItem('utm_params', JSON.stringify(newUtm));
      }
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  return observer;
}

export default {
  getUtmParams,
  storeUtmParams,
  getStoredUtmParams,
  clearUtmParams,
  getUtmForTracking,
  initUtmTracking,
};
