import axios from "axios";
import { getUtmForTracking } from "../utils/utmTracker";

// Use environment variable for API URL, remove trailing slash to avoid double slashes
const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const BEHAVIOR_API_URL = `${API_BASE}/api/behavior`;

// Create axios instance without auth (tracking is public)
const trackingClient = axios.create({
  baseURL: BEHAVIOR_API_URL,
  timeout: 10000,
});

// Create axios instance WITH auth (for admin endpoints)
const authClient = axios.create({
  baseURL: BEHAVIOR_API_URL,
  timeout: 10000,
  withCredentials: true,
  credentials: "include",
});

// Add auth token to admin requests
authClient.interceptors.request.use((config) => {
  // First try sessionStorage, then fall back to localStorage
  let token = sessionStorage.getItem("token");
  
  if (!token) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    token = user?.token;
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generate or retrieve session ID
function getSessionId() {
  let sessionId = sessionStorage.getItem("behavior_session_id");
  if (!sessionId) {
    sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("behavior_session_id", sessionId);
  }
  return sessionId;
}

// Get user ID if logged in
function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
}

// Get contact ID from CRM if linked
function getContactId() {
  return localStorage.getItem("crm_contact_id") || null;
}

// Track a user action
export async function trackAction(action, metadata = {}) {
  const sessionId = getSessionId();
  const userId = getUserId();
  const contactId = getContactId();
  const utmData = getUtmForTracking();

  try {
    const response = await trackingClient.post("/track", {
      sessionId,
      userId,
      contactId,
      action,
      ...utmData,
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        referrer: document.referrer,
        url: window.location.href,
        path: window.location.pathname,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Behavior tracking error:", error);
    return null;
  }
}

// Track page view
export function trackPageView(pageName) {
  return trackAction("page_view", { page: pageName });
}

// Track click
export function trackClick(element, elementId, elementText) {
  return trackAction("click", {
    element: element,
    elementId: elementId,
    elementText: elementText,
  });
}

// Track time spent
export function trackTimeSpent(pageName, durationSeconds) {
  return trackAction("time_spent", {
    page: pageName,
    duration: durationSeconds,
  });
}

// Track form submission
export function trackFormSubmit(formName, formData) {
  return trackAction("form_submit", {
    formName: formName,
    fieldsCount: Object.keys(formData).length,
  });
}

// Track search
export function trackSearch(query, resultsCount) {
  return trackAction("search", {
    query: query,
    resultsCount: resultsCount,
  });
}

// Track button click
export function trackButtonClick(buttonName, buttonLocation) {
  return trackAction("button_click", {
    buttonName: buttonName,
    buttonLocation: buttonLocation,
  });
}

// Track phone click
export function trackPhoneClick(phoneNumber) {
  return trackAction("phone_click", {
    phone: phoneNumber,
  });
}

// Track WhatsApp click
export function trackWhatsAppClick(phoneNumber) {
  return trackAction("whatsapp_click", {
    phone: phoneNumber,
  });
}

// Track exit/leave
export function trackExit(exitUrl) {
  return trackAction("exit", {
    exitUrl: exitUrl,
  });
}

// Link session to CRM contact
export async function linkToContact(contactId) {
  localStorage.setItem("crm_contact_id", contactId);
  return trackAction("linked_to_contact", { contactId });
}

// Get analytics data (for admin dashboard) - uses auth
export async function getAnalytics(params = {}) {
  const response = await authClient.get("/analytics", { params });
  return response.data;
}

// Get source analytics - uses auth
export async function getSourceAnalytics(params = {}) {
  const response = await authClient.get("/source-analytics", { params });
  return response.data;
}

// Get session history - uses auth
export async function getSessionHistory(sessionId) {
  const response = await authClient.get(`/session/${sessionId}`);
  return response.data;
}

// Get full user journey - uses auth
export async function getFullUserJourney(sessionId) {
  const response = await authClient.get(`/journey/full/${sessionId}`);
  return response.data;
}

// Get contact behaviors - uses auth
export async function getContactBehaviors(contactId) {
  const response = await authClient.get(`/contact-behaviors/${contactId}`);
  return response.data;
}

const behaviorTrackingAPI = {
  trackAction,
  trackPageView,
  trackClick,
  trackTimeSpent,
  trackFormSubmit,
  trackSearch,
  trackButtonClick,
  trackPhoneClick,
  trackWhatsAppClick,
  trackExit,
  linkToContact,
  getAnalytics,
  getSourceAnalytics,
  getSessionHistory,
  getFullUserJourney,
  getContactBehaviors,
  getSessionId,
  getUserId,
  getContactId,
};

export default behaviorTrackingAPI;
