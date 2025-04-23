const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const tagRoutes = require("./routes/tagRoutes");
const csvRoutes = require("./routes/csvRoutes");
const dashboardRoutes = require('./routes/dashboardRouter');

app.use("/api/auth", authRoutes);        //  Register/Login
app.use("/api/customers", customerRoutes); // Customers
app.use("/api/tags", tagRoutes);         //  Tags
app.use("/api/csv", csvRoutes);          //  CSV upload
app.use('/api/dashboard', dashboardRoutes); // Dashboard routes

// Global error handler
app.use((err, req, res, next) => {
  console.error(" Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
