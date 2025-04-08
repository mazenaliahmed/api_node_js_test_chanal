

# Mirth Connect HL7 to JSON API Channel

This project contains a Mirth Connect channel configuration that:
1. Receives HL7 v2 messages from patient registration systems
2. Converts the HL7 data to JSON format
3. Sends the JSON to a RESTful API endpoint
4. Processes the API response
5. Returns a confirmation message

## Setup Instructions

1. Import the `HL7_to_JSON_API_Channel.xml` file into your Mirth Connect instance
2. Modify the API endpoint URL in the channel configuration to match your environment
3. Deploy the channel
4. Configure your HL7 source system to send messages to this channel

## Channel Components

- Source Connector: Listens for incoming HL7 v2 messages
- Transformer: Converts HL7 to JSON format
- Destination Connector: Sends JSON to the API and processes the response

## Configuration

Update the following settings in the channel before deployment:
- API endpoint URL
- Authentication credentials (if required)
- Response handling preferences

## Testing

1. Start the API server by running `node server.js` or `node server.js` node test-hl7-sender.js 
3. Deploy the Mirth channel
4. Send a test HL7 message to the channel
5. Check the API server logs for the response
6. Verify the response in Mirth Connect

## License

