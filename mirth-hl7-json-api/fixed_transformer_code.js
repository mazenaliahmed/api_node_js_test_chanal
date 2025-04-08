// Convert HL7 to JSON
// This is the fixed version that works with Mirth Connect E4X objects

// Create a JSON object from the HL7 message
var jsonObject = {};

// Extract MSH segment data
jsonObject.message_header = {
    sending_application: msg['MSH']['MSH.3']['MSH.3.1'].toString(),
    sending_facility: msg['MSH']['MSH.4']['MSH.4.1'].toString(),
    receiving_application: msg['MSH']['MSH.5']['MSH.5.1'].toString(),
    receiving_facility: msg['MSH']['MSH.6']['MSH.6.1'].toString(),
    message_datetime: msg['MSH']['MSH.7']['MSH.7.1'].toString(),
    message_type: msg['MSH']['MSH.9']['MSH.9.1'].toString() + '^' + msg['MSH']['MSH.9']['MSH.9.2'].toString(),
    message_control_id: msg['MSH']['MSH.10']['MSH.10.1'].toString()
};

// Extract PID segment data
if (msg['PID']) {
    var nameParts = [];
    // Handle the possibility that some fields may not exist
    if (msg['PID']['PID.5']) {
        if (msg['PID']['PID.5']['PID.5.1']) nameParts[0] = msg['PID']['PID.5']['PID.5.1'].toString();
        if (msg['PID']['PID.5']['PID.5.2']) nameParts[1] = msg['PID']['PID.5']['PID.5.2'].toString();
        if (msg['PID']['PID.5']['PID.5.3']) nameParts[2] = msg['PID']['PID.5']['PID.5.3'].toString();
    }

    var patientId = "";
    if (msg['PID']['PID.3'] && msg['PID']['PID.3']['PID.3.1']) {
        patientId = msg['PID']['PID.3']['PID.3.1'].toString();
    }
    
    var address = {};
    if (msg['PID']['PID.11']) {
        if (msg['PID']['PID.11']['PID.11.1']) address.street = msg['PID']['PID.11']['PID.11.1'].toString();
        if (msg['PID']['PID.11']['PID.11.3']) address.city = msg['PID']['PID.11']['PID.11.3'].toString();
        if (msg['PID']['PID.11']['PID.11.4']) address.state = msg['PID']['PID.11']['PID.11.4'].toString();
        if (msg['PID']['PID.11']['PID.11.5']) address.zip = msg['PID']['PID.11']['PID.11.5'].toString();
    }

    jsonObject.patient = {
        id: patientId,
        last_name: nameParts[0] || '',
        first_name: nameParts[1] || '',
        middle_name: nameParts[2] || '',
        date_of_birth: msg['PID']['PID.7'] ? msg['PID']['PID.7']['PID.7.1'].toString() : '',
        gender: msg['PID']['PID.8'] ? msg['PID']['PID.8']['PID.8.1'].toString() : '',
        address: address
    };
    
    // Add phone numbers if available
    if (msg['PID']['PID.13']) {
        jsonObject.patient.phone_home = msg['PID']['PID.13']['PID.13.1'].toString();
    }
    
    if (msg['PID']['PID.14']) {
        jsonObject.patient.phone_business = msg['PID']['PID.14']['PID.14.1'].toString();
    }
    
    // Add SSN if available
    if (msg['PID']['PID.19']) {
        jsonObject.patient.ssn = msg['PID']['PID.19']['PID.19.1'].toString();
    }
}

// Extract PV1 segment data
if (msg['PV1']) {
    var doctorId = '';
    var doctorLastName = '';
    var doctorFirstName = '';
    
    if (msg['PV1']['PV1.7']) {
        if (msg['PV1']['PV1.7']['PV1.7.1']) doctorId = msg['PV1']['PV1.7']['PV1.7.1'].toString();
        if (msg['PV1']['PV1.7']['PV1.7.2']) doctorLastName = msg['PV1']['PV1.7']['PV1.7.2'].toString();
        if (msg['PV1']['PV1.7']['PV1.7.3']) doctorFirstName = msg['PV1']['PV1.7']['PV1.7.3'].toString();
    }
    
    jsonObject.visit = {
        patient_class: msg['PV1']['PV1.2'] ? msg['PV1']['PV1.2']['PV1.2.1'].toString() : '',
        assigned_location: msg['PV1']['PV1.3'] ? msg['PV1']['PV1.3']['PV1.3.1'].toString() : '',
        attending_doctor: {
            id: doctorId,
            last_name: doctorLastName,
            first_name: doctorFirstName
        }
    };
    
    // Add visit number if available
    if (msg['PV1']['PV1.19']) {
        jsonObject.visit.visit_number = msg['PV1']['PV1.19']['PV1.19.1'].toString();
    }
    
    // Add admission date if available
    if (msg['PV1']['PV1.44']) {
        jsonObject.visit.admission_date = msg['PV1']['PV1.44']['PV1.44.1'].toString();
    }
}

// Convert JSON object to a string
var jsonPayload = JSON.stringify(jsonObject, null, 2);
channelMap.put('jsonPayload', jsonPayload);
logger.info('Converted to JSON: ' + jsonPayload);

// Store the original message
channelMap.put('originalHL7', msg);

// Return the JSON payload
return jsonPayload;
