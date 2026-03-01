  const mongoose = require('mongoose');

  const connectDB = async () => {
    try {
      console.log("MongoDB connection start.......");
      
      // Check if MONGO_URI is defined
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not defined");
      }
      
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      // Don't exit process in serverless - throw error instead
      throw error;
    }
  };

  module.exports = connectDB;
