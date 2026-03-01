const mongoose = require("mongoose");

const crmContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ["website", "phone", "referral", "social_media", "advertisement", "facebook", "instagram", "whatsapp", "google", "direct", "organic", "other"],
      default: "website",
    },
    // Detailed social media tracking
    socialMediaSource: {
      type: String,
      enum: ["facebook", "instagram", "twitter", "linkedin", "youtube", "whatsapp", "google", null],
    },
    utmSource: {
      type: String,
    },
    utmMedium: {
      type: String,
    },
    utmCampaign: {
      type: String,
    },
    // First interaction details
    firstInteractionPage: {
      type: String,
    },
    firstInteractionSource: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "interested", "not_interested", "converted", "lost"],
      default: "new",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
    },
    interestedIn: {
      type: String,
      enum: ["pooja", "chadhava", "temple", "donation", "other"],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "interestedIn",
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
crmContactSchema.index({ phone: 1 });
crmContactSchema.index({ status: 1 });
crmContactSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CRMContact", crmContactSchema);
