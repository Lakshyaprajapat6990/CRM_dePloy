const mongoose = require("mongoose");

const crmInteractionSchema = new mongoose.Schema(
  {
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CRMContact",
      required: true,
    },
    type: {
      type: String,
      enum: ["call", "email", "sms", "meeting", "note", "payment", "booking", "other"],
      required: true,
    },
    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    outcome: {
      type: String,
      enum: ["successful", "no_response", "scheduled", "failed", "pending"],
    },
    scheduledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

// Index for faster queries
crmInteractionSchema.index({ contact: 1, createdAt: -1 });
crmInteractionSchema.index({ type: 1 });
crmInteractionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CRMInteraction", crmInteractionSchema);
