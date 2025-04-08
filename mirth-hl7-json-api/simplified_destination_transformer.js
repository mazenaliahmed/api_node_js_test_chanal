// Simplified destination transformer that works with raw API responses
var apiResponse = msg;
logger.info('Received API response: ' + apiResponse);

// Generate HL7 ACK response
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

// Create an accept ACK message
var ack = 'MSH|^~\\&|RECEIVING_APPLICATION|RECEIVING_FACILITY|' + 
          sendingApp + '|' + sendingFacility + '|' +
          currentDate + '||ACK^A01|ACK' + messageControlId + '|P|2.5\r' +
          'MSA|AA|' + messageControlId + '|Message processed\r';

channelMap.put('HL7_ACK_RESPONSE', ack);
return 'Message processed';
