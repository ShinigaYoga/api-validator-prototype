require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const generateRoute = require('./routes/generateRoute');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// API routes
app.use('/api/generate', generateRoute);
app.use('/api/upload', uploadRoutes);

// Catch-all for frontend (Express 5 compatible)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
