const mongoose = require("mongoose");

const userBehaviorSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CRMContact",
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["page_view", "click", "scroll", "form_submit", "form_start", "time_spent", "exit", "custom", "phone_click", "whatsapp_click", "booking"],
      index: true,
    },
    page: {
      type: String,
      required: true,
      index: true,
    },
    element: {
      type: String,
    },
    value: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    duration: {
      type: Number, // in milliseconds, for time_spent actions
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    referrer: {
      type: String,
    },
    // UTM Parameters for tracking social media sources
    utmSource: {
      type: String,
      index: true,
    },
    utmMedium: {
      type: String,
    },
    utmCampaign: {
      type: String,
    },
    utmTerm: {
      type: String,
    },
    utmContent: {
      type: String,
    },
    // Social media platform detection
    socialPlatform: {
      type: String,
      enum: ["facebook", "instagram", "twitter", "linkedin", "youtube", "whatsapp", "google", "direct", "organic", null],
      index: true,
    },
    // Entry point (first page user landed on)
    entryPage: {
      type: String,
    },
  },
  { timestamps: true }
);

// Compound indexes for efficient queries
userBehaviorSchema.index({ sessionId: 1, timestamp: -1 });
userBehaviorSchema.index({ userId: 1, timestamp: -1 });
userBehaviorSchema.index({ contactId: 1, timestamp: -1 });
userBehaviorSchema.index({ action: 1, page: 1, timestamp: -1 });
userBehaviorSchema.index({ utmSource: 1, timestamp: -1 });
userBehaviorSchema.index({ socialPlatform: 1, timestamp: -1 });

module.exports = mongoose.model("UserBehavior", userBehaviorSchema);
