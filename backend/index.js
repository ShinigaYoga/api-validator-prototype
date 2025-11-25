require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const generateRoute = require("./routes/generateRoute");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

// API routes
app.use("/api/generate", generateRoute);
app.use("/api/upload", uploadRoutes);

// Serve login page explicitly
app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

// Serve main app page
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Any other route → redirect to login (no wildcard crashing!)
app.use((req, res) => {
  res.redirect("/login");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
