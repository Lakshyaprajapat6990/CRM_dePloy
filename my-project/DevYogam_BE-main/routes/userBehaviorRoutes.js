const express = require('express');
const router = express.Router();
const userBehaviorController = require('../controllers/userBehaviorController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes - no authentication required for tracking
router.post('/track', userBehaviorController.trackBehavior);
router.post('/track-batch', userBehaviorController.trackBehaviors);

// Protected routes - admin only for analytics and data retrieval
router.get('/session/:sessionId', protect, adminOnly, userBehaviorController.getBehaviorsBySession);
router.get('/user/:userId', protect, adminOnly, userBehaviorController.getBehaviorsByUser);
router.get('/contact/:contactId', protect, adminOnly, userBehaviorController.getBehaviorsByContact);
router.get('/journey/:sessionId', protect, adminOnly, userBehaviorController.getUserJourney);
router.get('/analytics', protect, adminOnly, userBehaviorController.getAnalytics);
router.get('/recent', protect, adminOnly, userBehaviorController.getRecentBehaviors);
router.delete('/cleanup', protect, adminOnly, userBehaviorController.cleanupBehaviors);

// New source analytics routes
router.get('/source-analytics', protect, adminOnly, userBehaviorController.getSourceAnalytics);
router.get('/journey/full/:sessionId', protect, adminOnly, userBehaviorController.getFullUserJourney);
router.get('/contact-behaviors/:contactId', protect, adminOnly, userBehaviorController.getContactBehaviors);

module.exports = router;
