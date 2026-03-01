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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// More permissive CORS for Vercel serverless
app.use(cors({
  origin: true,
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
      description: "API documentation for Dev Yogam",
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

// Initialize database on module load (for Vercel serverless)
let dbPromise = null;

async function initDB() {
  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        await connectDB();
        await initializeDatabase();
        console.log("✅ Database initialized");
      } catch (error) {
        console.error("❌ Database initialization error:", error.message);
      }
    })();
  }
  return dbPromise;
}

// Initialize DB immediately when module loads
initDB();

// Export app for Vercel serverless functions
module.exports = app;
