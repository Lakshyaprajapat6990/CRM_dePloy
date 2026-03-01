const userBehaviorService = require("../services/userBehaviorService");

/**
 * Track a single user behavior
 */
async function trackBehavior(req, res) {
  try {
    // If page is missing, use a default value
    if (!req.body.page) {
      req.body.page = req.headers.referer || 'unknown';
    }
    
    // If action is missing, use a default value
    if (!req.body.action) {
      req.body.action = 'page_view';
    }
    
    const behavior = await userBehaviorService.trackBehavior(req.body);
    res.status(201).json(behavior);
  } catch (err) {
    console.error("Error tracking behavior:", err.message);
    res.status(400).json({ error: err.message });
  }
}

/**
 * Track multiple user behaviors (batch)
 */
async function trackBehaviors(req, res) {
  try {
    const { behaviors } = req.body;
    if (!behaviors || !Array.isArray(behaviors)) {
      return res.status(400).json({ error: "Behaviors array is required" });
    }
    
    // Add default action to each behavior if missing
    const normalizedBehaviors = behaviors.map(b => ({
      ...b,
      action: b.action || 'page_view',
      page: b.page || 'unknown',
    }));
    
    const saved = await userBehaviorService.trackBehaviors(normalizedBehaviors);
    res.status(201).json({ count: saved.length, behaviors: saved });
  } catch (err) {
    console.error("Error tracking behaviors:", err.message);
    res.status(400).json({ error: err.message });
  }
}

/**
 * Get behaviors by session
 */
async function getBehaviorsBySession(req, res) {
  try {
    const { sessionId } = req.params;
    const result = await userBehaviorService.getBehaviorsBySession(sessionId, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get behaviors by user
 */
async function getBehaviorsByUser(req, res) {
  try {
    const { userId } = req.params;
    const result = await userBehaviorService.getBehaviorsByUser(userId, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get behaviors by contact (CRM)
 */
async function getBehaviorsByContact(req, res) {
  try {
    const { contactId } = req.params;
    const result = await userBehaviorService.getBehaviorsByContact(contactId, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get user's journey (landing to exit)
 */
async function getUserJourney(req, res) {
  try {
    const { sessionId } = req.params;
    const journey = await userBehaviorService.getUserJourney(sessionId);
    res.json(journey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get analytics
 */
async function getAnalytics(req, res) {
  try {
    const analytics = await userBehaviorService.getAnalytics(req.query);
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get recent behaviors
 */
async function getRecentBehaviors(req, res) {
  try {
    const { limit = 20 } = req.query;
    const behaviors = await userBehaviorService.getRecentBehaviors(parseInt(limit));
    res.json(behaviors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Cleanup old behaviors
 */
async function cleanupBehaviors(req, res) {
  try {
    const { beforeDate } = req.body;
    if (!beforeDate) {
      return res.status(400).json({ error: "beforeDate is required" });
    }
    const result = await userBehaviorService.cleanupOldBehaviors(new Date(beforeDate));
    res.json({ message: "Cleanup completed", deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get social media source analytics
 */
async function getSourceAnalytics(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await userBehaviorService.getSourceAnalytics(startDate, endDate);
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get user journey with all interactions
 */
async function getFullUserJourney(req, res) {
  try {
    const { sessionId } = req.params;
    const journey = await userBehaviorService.getFullUserJourney(sessionId);
    res.json(journey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get contacts with their behavior data
 */
async function getContactBehaviors(req, res) {
  try {
    const { contactId } = req.params;
    const data = await userBehaviorService.getContactBehaviors(contactId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  trackBehavior,
  trackBehaviors,
  getBehaviorsBySession,
  getBehaviorsByUser,
  getBehaviorsByContact,
  getUserJourney,
  getAnalytics,
  getRecentBehaviors,
  cleanupBehaviors,
  getSourceAnalytics,
  getFullUserJourney,
  getContactBehaviors,
};
