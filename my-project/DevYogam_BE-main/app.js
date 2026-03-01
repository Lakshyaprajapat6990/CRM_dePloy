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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect DB and start server
(async () => {
  try {
    await connectDB();
    
    // Initialize database collections and indexes
    await initializeDatabase();

    // CORS setup - Allow both localhost and production frontend
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173", // Vite dev server
      process.env.CLIENT_URL,      // Production frontend URL from .env
      process.env.CLIENT_URL_2,   // Alternative production URL
      process.env.VERCEL_URL,     // Vercel preview/production URL
    ].filter(Boolean);

    app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (mobile apps, curl, server-to-server)
          if (!origin) return callback(null, true);
          
          if (allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            // For Vercel deployment, allow any vercel.app domain
            if (origin && origin.includes('.vercel.app')) {
              return callback(null, true);
            }
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );


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

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
