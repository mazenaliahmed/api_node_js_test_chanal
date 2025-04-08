// Create a mock API response (to be used in Response Transformer)
// This simulates what an API would respond with

// Create a JSON response object
var responseObject = {
  success: true,
  patientId: "MOCK_" + Math.floor(Math.random() * 100000),
  message: "Patient registration processed successfully (MOCK)",
  timestamp: new Date().toISOString()
};

// Convert to string
var jsonResponse = JSON.stringify(responseObject, null, 2);

// Log the mock response
logger.info("Generated mock API response: " + jsonResponse);

// Return the mock response
return jsonResponse;
