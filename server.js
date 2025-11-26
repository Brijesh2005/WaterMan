require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

// Load environment variables
dotenv.config({ debug: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const usersRoutes = require('./routes/users');
const waterMetersRoutes = require('./routes/waterMeters');
const consumptionRecordsRoutes = require('./routes/consumptionRecords');
const billingRoutes = require('./routes/billing');
const waterSourcesRoutes = require('./routes/waterSources');
const conservationMethodsRoutes = require('./routes/conservationMethods');
const implementationRecordsRoutes = require('./routes/implementationRecords');

// Use routes
app.use('/api/users', usersRoutes);
app.use('/api/water-meters', waterMetersRoutes);
app.use('/api/consumption-records', consumptionRecordsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/water-sources', waterSourcesRoutes);
app.use('/api/conservation-methods', conservationMethodsRoutes);
app.use('/api/implementation-records', implementationRecordsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Water Management System API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  process.exit(0);
});

startServer();
