const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());

// Explicit allow-list rather than a wide-open "*" — set CLIENT_ORIGIN in .env
const allowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((s) => s.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // higher limit to allow base64 image uploads if needed
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
