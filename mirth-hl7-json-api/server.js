const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev')); // Logging

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Main endpoint for receiving patient registration data
app.post('/api/patients', (req, res) => {
  try {
    console.log('Received patient data:', JSON.stringify(req.body, null, 2));
    
    // Extract patient information
    const patientData = req.body;
    const patientId = patientData.patient?.id || `PT${Date.now()}`;
    
    // Save patient data to a JSON file
    const filename = path.join(dataDir, `patient_${patientId}_${Date.now()}.json`);
    fs.writeFileSync(filename, JSON.stringify(patientData, null, 2));
    
    // Log successful registration
    console.log(`Patient registration successful. ID: ${patientId}, saved to ${filename}`);
    
    // Send success response back to Mirth Connect
    res.json({
      success: true,
      patientId: patientId,
      message: "Patient registration processed successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing patient registration:', error);
    
    // Send error response back to Mirth Connect
    res.status(500).json({
      success: false,
      message: `Error processing registration: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Patient Registration API server running on port ${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/patients`);
});
