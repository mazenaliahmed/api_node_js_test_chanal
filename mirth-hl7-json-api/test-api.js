const fetch = require('node-fetch');

// Test data that resembles the transformed HL7 message
const testData = {
  message_header: {
    sending_application: "SENDING_APPLICATION",
    sending_facility: "SENDING_FACILITY",
    receiving_application: "RECEIVING_APPLICATION",
    receiving_facility: "RECEIVING_FACILITY",
    message_datetime: "20250407235500",
    message_type: "ADT^A01",
    message_control_id: "MSG00001"
  },
  patient: {
    id: "10001",
    last_name: "TEST",
    first_name: "PATIENT",
    middle_name: "M",
    date_of_birth: "19700101",
    gender: "M",
    address: {
      street: "123 TEST STREET",
      city: "TEST CITY",
      state: "TEST STATE",
      zip: "12345"
    },
    phone_home: "5555551234",
    ssn: "123456789"
  },
  visit: {
    patient_class: "I",
    assigned_location: "GENERAL",
    attending_doctor: {
      id: "123",
      last_name: "TEST",
      first_name: "DOCTOR"
    }
  }
};

// Function to test API
async function testAPI() {
  try {
    console.log('Sending test data to API...');
    
    const response = await fetch('http://localhost:3000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    console.log('API Response:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testAPI();
