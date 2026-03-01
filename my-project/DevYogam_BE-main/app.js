require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const poojaRoutes = require("./routes/poojaRoutes");
const templeRoutes = require("./routes/templeRoutes");
const chadavaRoutes = require("./routes/chadhavaRoutes");
const payRoutes = require("./routes/payRoutes");
const fileRoutes = require("./routes/fileRoutes");
const reviewsRoutes = require('./routes/reviewsRoutes')
const crmRoutes = require('./routes/crmRoutes');
const userBehaviorRoutes = require('./routes/userBehaviorRoutes');
const { initializeDatabase } = require('./config/initBehaviorDB');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Flag to track if DB is initialized
let isDBInitialized = false;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// More permissive CORS for Vercel serverless
app.use(cors({
  origin: true, // Allow all origins in production
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  preflightContinue: false,
}));

// Favicon handler (prevent 404 errors in browser)
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Dev Yogam API",
      version: "1.0.0",
      description: "API documentation for Dev Yogam (Users, Poojas, Temples, Payments, Files)",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/poojas", poojaRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/chadhavas", chadavaRoutes);
app.use("/api/payment", payRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/reviews",reviewsRoutes)
app.use("/api/crm", crmRoutes);
app.use("/api/behavior", userBehaviorRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Initialize database function (for serverless - called on first request)
const initDB = async () => {
  if (!isDBInitialized) {
    try {
      await connectDB();
      await initializeDatabase();
      isDBInitialized = true;
      console.log("✅ Database initialized");
    } catch (error) {
      console.error("❌ Database initialization error:", error.message);
      // Don't crash - let the function handle DB errors per-request
    }
  }
};

// Middleware to ensure DB is initialized before handling routes
app.use(async (req, res, next) => {
  // Skip DB init for root and favicon
  if (req.path === '/' || req.path === '/favicon.ico') {
    return next();
  }
  await initDB();
  next();
});

// Export app for Vercel serverless functions
module.exports = app;
