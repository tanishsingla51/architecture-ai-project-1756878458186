const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiRouter = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security-related HTTP headers
app.use(express.json({ limit: '16kb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Parse URL-encoded bodies

// API Routes
app.use('/api/v1', apiRouter);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
