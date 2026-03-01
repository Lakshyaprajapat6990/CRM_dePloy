const UserBehavior = require("../models/UserBehavior");
const CRMContact = require("../models/CRMContact");
const mongoose = require("mongoose");

// ==================== TRACKING OPERATIONS ====================

/**
 * Track a user action
 * @param {Object} data - Behavior data
 * @returns {Promise<Object>} - Saved behavior record
 */
async function trackBehavior(data) {
  const {
    sessionId,
    userId,
    contactId,
    action,
    page,
    element,
    value,
    duration,
    metadata,
    userAgent,
    ipAddress,
    referrer,
    // UTM parameters
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    socialPlatform,
  } = data;

  // If userId is provided but no contactId, try to find or create contact
  let finalContactId = contactId;
  if (!finalContactId && userId) {
    const user = await mongoose.model("User").findById(userId);
    if (user) {
      let contact = await CRMContact.findOne({
        $or: [{ phone: user.phone }, { email: user.email }],
      });
      
      if (!contact) {
        // Determine source from UTM or referrer
        const source = determineSource(utmSource, referrer);
        contact = await CRMContact.create({
          name: user.email?.split("@")[0] || "Anonymous User",
          phone: user.phone,
          email: user.email,
          source: source,
          status: "new",
        });
      }
      finalContactId = contact._id;
    }
  }

  // Determine source if contact exists but no source set
  let contactUpdate = {};
  if (finalContactId) {
    const contact = await CRMContact.findById(finalContactId);
    if (contact && !contact.source) {
      contactUpdate = {
        source: determineSource(utmSource, referrer),
      };
    }
  }

  const behavior = new UserBehavior({
    sessionId,
    userId: userId || null,
    contactId: finalContactId || null,
    action,
    page,
    element,
    value,
    duration,
    metadata,
    userAgent,
    ipAddress,
    referrer,
    // UTM parameters
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  });

  const saved = await behavior.save();
  
  // Update contact with source if needed
  if (finalContactId && Object.keys(contactUpdate).length > 0) {
    await CRMContact.findByIdAndUpdate(finalContactId, contactUpdate);
  }
  
  // Auto-create contact for phone clicks, WhatsApp clicks, form submits
  if (["phone_click", "whatsapp_click", "form_submit"].includes(action)) {
    await autoCreateContactFromAction(data, finalContactId);
  }

  return saved;
}

/**
 * Determine source from UTM or referrer
 */
function determineSource(utmSource, referrer) {
  if (utmSource) {
    const sourceMap = {
      facebook: "social_media",
      instagram: "social_media",
      twitter: "social_media",
      linkedin: "social_media",
      google: "advertisement",
      bing: "advertisement",
      whatsapp: "referral",
    };
    return sourceMap[utmSource.toLowerCase()] || utmSource;
  }
  
  if (referrer) {
    if (referrer.includes("facebook")) return "social_media";
    if (referrer.includes("instagram")) return "social_media";
    if (referrer.includes("google")) return "advertisement";
    if (referrer.includes("whatsapp")) return "referral";
  }
  
  return "website";
}

/**
 * Auto-create contact from phone/whatsapp/form interactions
 */
async function autoCreateContactFromAction(data, existingContactId) {
  const { action, metadata, sessionId, utmSource, referrer } = data;
  
  // Check if we already have a contact for this session
  if (existingContactId) return;
  
  // Get latest behavior to get contact info
  const lastBehavior = await UserBehavior.findOne({ sessionId })
    .sort({ timestamp: -1 });
    
  if (!lastBehavior) return;
  
  // Create contact if phone/WhatsApp clicked
  if (action === "phone_click" || action === "whatsapp_click") {
    const phone = metadata?.phone;
    if (phone) {
      const existing = await CRMContact.findOne({ phone });
      if (!existing) {
        await CRMContact.create({
          name: `Lead from ${determineSource(utmSource, referrer)}`,
          phone: phone,
          source: determineSource(utmSource, referrer),
          status: "new",
          notes: `Contact via ${action} - Session: ${sessionId}`,
        });
      }
    }
  }
}

/**
 * Track multiple behaviors at once (batch)
 * @param {Array} behaviors - Array of behavior data
 * @returns {Promise<Array>} - Saved behavior records
 */
async function trackBehaviors(behaviors) {
  const savedBehaviors = await UserBehavior.insertMany(behaviors);
  return savedBehaviors;
}

/**
 * Get all behaviors for a session
 * @param {string} sessionId 
 * @param {Object} query 
 * @returns {Promise<Object>} - Behaviors and pagination info
 */
async function getBehaviorsBySession(sessionId, query = {}) {
  const { page = 1, limit = 50, action, page: pageFilter } = query;
  
  const filter = { sessionId };
  if (action) filter.action = action;
  if (pageFilter) filter.page = pageFilter;

  const behaviors = await UserBehavior.find(filter)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("userId", "name email phone")
    .populate("contactId", "name email phone");

  const total = await UserBehavior.countDocuments(filter);

  return {
    behaviors,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get all behaviors for a user
 * @param {string} userId 
 * @param {Object} query 
 * @returns {Promise<Object>} - Behaviors and pagination info
 */
async function getBehaviorsByUser(userId, query = {}) {
  const { page = 1, limit = 50 } = query;
  
  const behaviors = await UserBehavior.find({ userId })
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await UserBehavior.countDocuments({ userId });

  return {
    behaviors,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get all behaviors for a contact
 * @param {string} contactId 
 * @param {Object} query 
 * @returns {Promise<Object>} - Behaviors and pagination info
 */
async function getBehaviorsByContact(contactId, query = {}) {
  const { page = 1, limit = 50 } = query;
  
  const behaviors = await UserBehavior.find({ contactId })
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await UserBehavior.countDocuments({ contactId });

  return {
    behaviors,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get user's journey (ordered page views)
 * @param {string} sessionId 
 * @returns {Promise<Array>} - Ordered journey
 */
async function getUserJourney(sessionId) {
  const behaviors = await UserBehavior.find({ sessionId })
    .sort({ timestamp: 1 });
  
  return behaviors;
}

/**
 * Get comprehensive analytics
 * @param {Object} query - Query filters
 * @returns {Promise<Object>} - Analytics data
 */
async function getAnalytics(query = {}) {
  const { startDate, endDate, action, page } = query;
  
  const filter = {};
  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
  }
  if (action) filter.action = action;
  if (page) filter.page = page;

  // Get unique sessions
  const uniqueSessions = await UserBehavior.distinct("sessionId", filter);
  
  // Get unique users
  const uniqueUsers = await UserBehavior.distinct("userId", { ...filter, userId: { $ne: null } });
  
  // Get action counts
  const actionCounts = await UserBehavior.aggregate([
    { $match: filter },
    { $group: { _id: "$action", count: { $sum: 1 } } },
  ]);
  
  // Get page views
  const pageViews = await UserBehavior.countDocuments({ ...filter, action: "page_view" });
  
  // Get top pages
  const topPages = await UserBehavior.aggregate([
    { $match: { ...filter, action: "page_view" } },
    { $group: { _id: "$page", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  
  // Get entry points
  const entryPoints = await UserBehavior.aggregate([
    { $match: { ...filter, action: "page_view" } },
    { $sort: { sessionId: 1, timestamp: 1 } },
    { $group: { 
      _id: "$sessionId", 
      entryPage: { $first: "$page" },
      referrer: { $first: "$referrer" },
    }},
    { $group: { 
      _id: "$entryPage", 
      count: { $sum: 1 },
      referrers: { $push: "$referrer" }
    }},
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return {
    totalSessions: uniqueSessions.length,
    uniqueUsers: uniqueUsers.length,
    totalPageViews: pageViews,
    actionCounts: actionCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    topPages,
    entryPoints,
  };
}

/**
 * Get source analytics (social media, UTM, etc.)
 * @param {string} startDate 
 * @param {string} endDate 
 * @returns {Promise<Object>} - Source analytics data
 */
async function getSourceAnalytics(startDate, endDate) {
  const filter = {};
  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
  }

  // Get sessions by UTM source
  const sessionsBySource = await UserBehavior.aggregate([
    { $match: { ...filter, utmSource: { $exists: true, $ne: null } } },
    { $group: { _id: "$utmSource", sessions: { $addToSet: "$sessionId" } } },
    { $project: { _id: 1, sessions: { $size: "$sessions" } } },
    { $sort: { sessions: -1 } },
  ]);

  // Get sessions by referrer
  const sessionsByReferrer = await UserBehavior.aggregate([
    { $match: { ...filter, referrer: { $exists: true, $ne: null }, utmSource: { $exists: false } } },
    { $addFields: { referrerDomain: { $arrayElemAt: [{ $split: ["$referrer", "/"] }, 2] } } },
    { $group: { _id: "$referrerDomain", sessions: { $addToSet: "$sessionId" } } },
    { $project: { _id: 1, sessions: { $size: "$sessions" } } },
    { $sort: { sessions: -1 } },
    { $limit: 10 },
  ]);

  // Get conversions (form_submit, phone_click, whatsapp_click) by source
  const conversionsBySource = await UserBehavior.aggregate([
    { 
      $match: { 
        ...filter, 
        action: { $in: ["form_submit", "phone_click", "whatsapp_click", "payment"] }
      }
    },
    { $group: { _id: "$utmSource", conversions: { $sum: 1 } } },
    { $sort: { conversions: -1 } },
  ]);

  // Get contacts by source
  const contactsBySource = await CRMContact.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$source", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Merge sessions from UTM and referrer
  const allSources = {};
  sessionsBySource.forEach(item => {
    allSources[item._id] = (allSources[item._id] || 0) + item.sessions;
  });
  sessionsByReferrer.forEach(item => {
    const domain = item._id || "direct";
    allSources[domain] = (allSources[domain] || 0) + item.sessions;
  });

  return {
    sessionsBySource,
    sessionsByReferrer,
    conversionsBySource,
    contactsBySource,
    totalSources: Object.keys(allSources).length,
  };
}

/**
 * Get full user journey with all details
 * @param {string} sessionId 
 * @returns {Promise<Object>} - Full journey details
 */
async function getFullUserJourney(sessionId) {
  const behaviors = await UserBehavior.find({ sessionId })
    .sort({ timestamp: 1 });

  if (!behaviors || behaviors.length === 0) {
    return { error: "No behaviors found for this session" };
  }

  const firstBehavior = behaviors[0];
  const pageViews = behaviors.filter(b => b.action === "page_view");

  return {
    sessionId,
    entryPage: firstBehavior.page,
    entrySource: firstBehavior.utmSource || determineSourceFromReferrer(firstBehavior.referrer),
    utmSource: firstBehavior.utmSource,
    utmMedium: firstBehavior.utmMedium,
    utmCampaign: firstBehavior.utmCampaign,
    referrer: firstBehavior.referrer,
    totalPageViews: pageViews.length,
    totalActions: behaviors.length,
    journey: behaviors.map(b => ({
      action: b.action,
      page: b.page,
      element: b.element,
      timestamp: b.timestamp,
      duration: b.duration,
    })),
  };
}

/**
 * Get contact behaviors
 * @param {string} contactId 
 * @returns {Promise<Object>} - Contact behaviors
 */
async function getContactBehaviors(contactId) {
  const contact = await CRMContact.findById(contactId);
  if (!contact) {
    return { error: "Contact not found" };
  }

  const behaviors = await UserBehavior.find({ contactId })
    .sort({ timestamp: -1 })
    .limit(100);

  // Group by session
  const sessions = {};
  behaviors.forEach(b => {
    if (!sessions[b.sessionId]) {
      sessions[b.sessionId] = {
        sessionId: b.sessionId,
        behaviors: [],
        startTime: b.timestamp,
        endTime: b.timestamp,
      };
    }
    sessions[b.sessionId].behaviors.push(b);
    if (b.timestamp < sessions[b.sessionId].startTime) {
      sessions[b.sessionId].startTime = b.timestamp;
    }
    if (b.timestamp > sessions[b.sessionId].endTime) {
      sessions[b.sessionId].endTime = b.timestamp;
    }
  });

  return {
    contact,
    totalBehaviors: behaviors.length,
    sessions: Object.values(sessions),
  };
}

/**
 * Helper to determine source from referrer
 */
function determineSourceFromReferrer(referrer) {
  if (!referrer) return "direct";
  if (referrer.includes("facebook")) return "facebook";
  if (referrer.includes("instagram")) return "instagram";
  if (referrer.includes("google")) return "google";
  if (referrer.includes("whatsapp")) return "whatsapp";
  return "direct";
}

/**
 * Get recent behaviors
 * @param {number} limit 
 * @returns {Promise<Array>} - Recent behaviors
 */
async function getRecentBehaviors(limit = 20) {
  return await UserBehavior.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate("userId", "name email phone")
    .populate("contactId", "name email phone");
}

/**
 * Delete old behaviors (for data cleanup)
 * @param {Date} beforeDate 
 * @returns {Promise<Object>} - Delete result
 */
async function cleanupOldBehaviors(beforeDate) {
  return await UserBehavior.deleteMany({
    timestamp: { $lt: beforeDate },
  });
}

module.exports = {
  // Tracking operations
  trackBehavior,
  trackBehaviors,
  
  // Query operations
  getBehaviorsBySession,
  getBehaviorsByUser,
  getBehaviorsByContact,
  getUserJourney,
  getAnalytics,
  getRecentBehaviors,
  
  // Source analytics
  getSourceAnalytics,
  getFullUserJourney,
  getContactBehaviors,
  
  // Maintenance
  cleanupOldBehaviors,
};
