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
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect DB and start server
(async () => {
  try {
    await connectDB();

    const allowedOrigins = [
      process.env.CLIENT_URL_LOCAL,
      process.env.CLIENT_URL,
      process.env.CLIENT_URL_2,
    ];

    // CORS setup
    // const allowedOrigins = [
    //   "http://localhost:3000", // ✅ allow deployed frontend
    // ];
app.use(cors({
  origin: "http://localhost:3000",  // frontend ka exact URL
  credentials: true
}));
    // app.use(
    //   cors({
    //     origin: (origin, callback) => {
    //       if (!origin) return callback(null, true); // allow curl / server-to-server
    //       if (allowedOrigins.includes(origin)) {
    //         callback(null, true);
    //       } else {
    //         callback(new Error("Not allowed by CORS"));
    //       }
    //     },
    //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    //     credentials: true,
    //     allowedHeaders: ["Content-Type", "Authorization"],
    //   })
    // );


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
