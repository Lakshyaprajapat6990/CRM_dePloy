/**
 * Database Initialization Script
 * Automatically creates the UserBehavior collection and sets up indexes
 * This runs automatically when the server starts
 */

const mongoose = require('mongoose');
const UserBehavior = require('../models/UserBehavior');
const CRMContact = require('../models/CRMContact');

/**
 * Initialize database collections and indexes
 * This function is called automatically when the server starts
 */
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database collections...');
    
    // Ensure all models are registered (this creates collections)
    
    // Create indexes for UserBehavior collection
    await UserBehavior.createIndexes();
    console.log('✅ UserBehavior indexes created');

    // Verify CRMContact indexes
    await CRMContact.createIndexes();
    console.log('✅ CRMContact indexes verified');

    // Get list of all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('📊 Available collections:', collectionNames.join(', '));

    // Check if UserBehavior collection exists
    if (collectionNames.includes('userbehaviors')) {
      const count = await UserBehavior.countDocuments();
      console.log(`📈 UserBehavior collection has ${count} documents`);
    }

    console.log('✅ Database initialization complete');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Don't throw - we don't want to stop the server if initialization fails
    return false;
  }
}

/**
 * Sync database - creates all collections and indexes
 * Can be called manually if needed
 */
async function syncDatabase() {
  try {
    console.log('🔄 Syncing database...');
    
    // Force sync indexes
    await UserBehavior.syncIndexes();
    console.log('✅ UserBehavior indexes synced');

    // Get indexes for UserBehavior
    const indexes = await UserBehavior.collection.indexes();
    console.log('📋 UserBehavior indexes:', JSON.stringify(indexes, null, 2));

    console.log('✅ Database sync complete');
    return { success: true, indexes };
  } catch (error) {
    console.error('❌ Database sync error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get database statistics
 */
async function getDatabaseStats() {
  try {
    const stats = {
      userBehaviors: await UserBehavior.countDocuments(),
      crmContacts: await CRMContact.countDocuments(),
      sessions: await UserBehavior.distinct('sessionId'),
      users: await UserBehavior.distinct('userId'),
    };
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    return null;
  }
}

module.exports = {
  initializeDatabase,
  syncDatabase,
  getDatabaseStats,
};
