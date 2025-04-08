const net = require('net');
const fs = require('fs');
const path = require('path');

// Configuration
const HOST = 'localhost';  // Mirth Connect server host
const PORT = 6661;         // Port configured in the Mirth channel
const HL7_FILE = path.join(__dirname, 'sample_hl7_message.txt');

// Read the HL7 message from file
let hl7Message;
try {
  hl7Message = fs.readFileSync(HL7_FILE, 'utf8');
  console.log('Loaded HL7 message:');
  console.log(hl7Message);
} catch (err) {
  console.error(`Error reading HL7 file: ${err.message}`);
  process.exit(1);
}

// Prepare HL7 message with proper MLLP framing
// MLLP uses vertical tab (VT, ASCII 11, hex 0x0B) as start block and 
// file separator (FS, ASCII 28, hex 0x1C) followed by carriage return (CR, ASCII 13, hex 0x0D) as end block
const MLLPWrappedMessage = String.fromCharCode(0x0B) + hl7Message + String.fromCharCode(0x1C) + String.fromCharCode(0x0D);

// Create socket client
const client = new net.Socket();

// Connect to Mirth Channel
client.connect(PORT, HOST, () => {
  console.log(`Connected to ${HOST}:${PORT}`);
  console.log('Sending HL7 message...');
  
  // Send the MLLP-wrapped HL7 message
  client.write(MLLPWrappedMessage);
  console.log('Message sent!');
});

// Handle data received (ACK from Mirth)
client.on('data', (data) => {
  // Remove MLLP framing from received data
  const response = data.toString('utf8').substring(1, data.length - 2);
  console.log('\nReceived response:');
  console.log(response);
  
  // Close the connection
  client.end();
});

// Handle errors
client.on('error', (err) => {
  console.error(`Connection error: ${err.message}`);
});

// Handle connection close
client.on('close', () => {
  console.log('Connection closed');
});
