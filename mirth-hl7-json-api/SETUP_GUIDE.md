# Mirth Connect HL7 to JSON API Setup Guide

This guide explains how to set up and use the Mirth Connect channel that receives HL7 v2 messages, converts them to JSON, sends them to an API, and processes the API response.

## Prerequisites

- Mirth Connect installed and running
- Node.js installed (for the API server)
- Basic understanding of HL7 v2 messages and Mirth Connect

## Setup Instructions

### 1. Start the API Server

First, install the necessary Node.js packages and start the API server:

```bash
# Navigate to the project directory
cd C:\Users\mazen\CascadeProjects\mirth-hl7-json-api

# Install dependencies
npm install

# Start the API server
node server.js
```

The API server will run on port 8080 and will receive JSON data from Mirth Connect.

### 2. Import the Mirth Connect Channel

1. Open your Mirth Connect Administrator (typically at http://localhost:8080)
2. Log in with your credentials
3. Navigate to Channels
4. Click on "Import Channel" from the context menu
5. Select the `HL7_to_JSON_API_Channel.xml` file from this project
6. Click "Import"
7. Verify the channel settings, particularly:
   - Source connector port (default: 6661)
   - Destination HTTP URL (default: http://localhost:8080/api/patients)
8. Deploy the channel

### 3. Test the Workflow

1. Make sure both the API server and Mirth Connect are running
2. Open a new terminal and run the test script:

```bash
# Navigate to the project directory
cd C:\Users\mazen\CascadeProjects\mirth-hl7-json-api

# Run the test script
node test-hl7-sender.js
```

This will send the sample HL7 message to Mirth Connect, which will:
1. Receive the HL7 message
2. Convert it to JSON
3. Send it to the API endpoint
4. Process the API response
5. Return an acknowledgment message

## File Structure

- `HL7_to_JSON_API_Channel.xml` - Mirth Connect channel configuration
- `server.js` - Node.js API server
- `sample_hl7_message.txt` - Sample HL7 v2 message for testing
- `test-hl7-sender.js` - Test script to send HL7 messages to Mirth Connect
- `package.json` - Node.js project configuration
- `README.md` - Project overview
- `SETUP_GUIDE.md` - This setup guide

## Channel Configuration Details

The Mirth Connect channel is configured with:

- **Source Connector**: TCP Listener on port 6661 that receives HL7 v2 messages
- **Transformer**: JavaScript that converts HL7 to JSON format
- **Destination Connector**: HTTP sender that posts JSON to the API
- **Response Handler**: Processes API response and generates HL7 ACK

## Customization

You may need to modify:

1. The API endpoint URL in the channel configuration if the API server is running on a different host/port
2. The port in the source connector if 6661 is already in use
3. The HL7 parsing logic if your messages have a different structure

## Troubleshooting

- Check Mirth Connect dashboard for channel errors
- Check the API server console for request logs
- Verify network connectivity between Mirth Connect and the API server
- Enable message logging in Mirth Connect for debugging
