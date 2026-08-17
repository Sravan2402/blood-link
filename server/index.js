const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const dashboardRequest = require("./routes/dashboardRequest");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

pool
  .query("SELECT 1")
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed");
    console.error(err.message);
  });

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to BloodLink API 🚑",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/dashboard", dashboardRequest);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
