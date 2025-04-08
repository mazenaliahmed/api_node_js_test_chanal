// Process API Response
// This is the fixed version that handles non-JSON responses

var apiResponse = msg;
logger.info('Received API response: ' + apiResponse);

try {
    // Try to parse the response as JSON, but handle non-JSON responses
    var responseJson;
    var success = false;
    var patientId = '';
    var message = '';
    
    if (typeof apiResponse === 'string' && apiResponse.trim().startsWith('{')) {
        // Looks like JSON, try to parse it
        responseJson = JSON.parse(apiResponse);
        success = responseJson.success || false;
        patientId = responseJson.patientId || '';
        message = responseJson.message || 'No message from API';
    } else {
        // Not JSON, handle as plain text or other format
        logger.warn('API response is not in JSON format: ' + apiResponse);
        success = false;
        message = 'Received non-JSON response from API';
    }
    
    // Store the response data in the channel map
    channelMap.put('apiResponseSuccess', success);
    channelMap.put('apiResponsePatientId', patientId);
    channelMap.put('apiResponseMessage', message);
    
    // Get the original HL7 message from channel map
    var originalHL7 = channelMap.get('originalHL7');
    
    // Create a currentDate for the response
    var currentDate = new java.text.SimpleDateFormat('yyyyMMddHHmmss').format(new java.util.Date());
    
    // Generate HL7 ACK response
    var ackCode = success ? 'AA' : 'AE';
    var ackMessage = success ? 'Message processed successfully' : 'Error processing message: ' + message;
    
    // Extract fields from the original message for response
    var sendingApp = '';
    var sendingFacility = '';
    var messageControlId = '';
    
    if (originalHL7 && originalHL7['MSH']) {
        sendingApp = originalHL7['MSH']['MSH.3'] ? originalHL7['MSH']['MSH.3']['MSH.3.1'].toString() : '';
        sendingFacility = originalHL7['MSH']['MSH.4'] ? originalHL7['MSH']['MSH.4']['MSH.4.1'].toString() : '';
        messageControlId = originalHL7['MSH']['MSH.10'] ? originalHL7['MSH']['MSH.10']['MSH.10.1'].toString() : '';
    }
    
    // Build HL7 ACK message
    var ack = 'MSH|^~\\&|RECEIVING_APPLICATION|RECEIVING_FACILITY|' + 
              sendingApp + '|' + sendingFacility + '|' +
              currentDate + '||ACK^A01|ACK' + messageControlId + '|P|2.5\r' +
              'MSA|' + ackCode + '|' + messageControlId + '|' + ackMessage + '\r';
    
    if (success) {
        ack += 'ZPA|' + patientId + '|Registration successful\r';
    }
    
    channelMap.put('HL7_ACK_RESPONSE', ack);
    return ackMessage;
} catch (e) {
    logger.error('Error processing API response: ' + e);
    
    // Generate an error ACK message
    var originalHL7 = channelMap.get('originalHL7');
    var sendingApp = '';
    var sendingFacility = '';
    var messageControlId = '';
    
    if (originalHL7 && originalHL7['MSH']) {
        sendingApp = originalHL7['MSH']['MSH.3'] ? originalHL7['MSH']['MSH.3']['MSH.3.1'].toString() : '';
        sendingFacility = originalHL7['MSH']['MSH.4'] ? originalHL7['MSH']['MSH.4']['MSH.4.1'].toString() : '';
        messageControlId = originalHL7['MSH']['MSH.10'] ? originalHL7['MSH']['MSH.10']['MSH.10.1'].toString() : '';
    }
    
    var currentDate = new java.text.SimpleDateFormat('yyyyMMddHHmmss').format(new java.util.Date());
    
    var ackMessage = 'MSH|^~\\&|RECEIVING_APPLICATION|RECEIVING_FACILITY|' + 
                   sendingApp + '|' + sendingFacility + '|' +
                   currentDate + '||ACK^A01|ACK' + messageControlId + '|P|2.5\r' +
                   'MSA|AE|' + messageControlId + '|Error processing API response\r';
    
    channelMap.put('HL7_ACK_RESPONSE', ackMessage);
    return 'Error processing API response: ' + e;
}
