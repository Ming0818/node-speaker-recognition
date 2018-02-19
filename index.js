"use strict";

const cognitive = require('./src/index.js');
const config = require('./config.js');
const fs = require('fs');

const client = new cognitive.speakerIdentification({
    apiKey: config.speakerRecognition.apiKey,
    endpoint: config.speakerRecognition.endpoint
});


function createAndEnroll(trainingAudio,callback) {
    // Create User Profile
    console.log('Creating identification profile...')
    const body = {
        locale: 'en-US'
    }
    client.createProfile({
        body
    }).then(response => {
        var identificationProfileId = response.identificationProfileId;
        console.log(identificationProfileId);

        
        //Enroll User Voice
        console.log('Enrolling identification profile...')
        
        const parameters = { identificationProfileId: identificationProfileId }
        const body = fs.readFileSync(trainingAudio);
        const headers = { 'Content-type': 'application/octet-stream' }
        
        client.createEnrollment({parameters,headers,body}).then(response => {
            callback(identificationProfileId,null)
        }).catch(err => {
            callback(null,err)
        });
    }).catch(err => {
        callback(null,err)
    });
}


function checkIfEnroll(identificationProfileId,callback) {
    const parameters = { identificationProfileId: identificationProfileId }
    client.getProfile({parameters}).then(response => {
        callback(response,null)
    }).catch(err => {
        callback(null,err)
    });
}


function Operation(identificationProfileIds,testAudio,callback){
    var parameters = {identificationProfileIds: identificationProfileIds}
    const headers = {'Content-type': 'application/octet-stream'}
    const body = fs.readFileSync(testAudio);
    
    client.identify({parameters,headers,body}).then((response) => {
        callback(response,null);
    }).catch(err => {
        callback(null,err)
    });
}

function Identify(operationId,callback){
    var parameters = {operationId: operationId}
    client.getOperationStatus({parameters}).then((response) => {
        callback(response,null)
    }).catch(err => {
        callback(null,err)
    });
}



//Tests

// createAndEnroll('./test/assets/training/kameswari_voice.wav',function(res,err){
//     console.log(res);
// });

// checkIfEnroll("0f6375b2-f342-4cd5-936a-9efc833bc071", function(res,err){
//     console.log(res);
// });

// Operation("0f6375b2-f342-4cd5-936a-9efc833bc071",'./test/assets/training/kameswari_voice.wav', function(res,err){
//     console.log(res);
// });

// Identify("7b3dc2f5-dd6c-4f5e-8938-8a0d7d046431", function(res,err){
//     console.log(res);
// });