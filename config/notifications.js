
'use strict'; // NO SONAR

const promise = require('bluebird'),
    winston = require('winston');

let generateEndPoint = req => {
    if (!req.body.deviceToken) {
        return promise.resolve();
    }
    return makeEndPointForNotifications(req.body.deviceType, req.body.deviceToken).catch(err => {
        return promise.reject(err);
    });
}

let makeEndPointForNotifications = (deviceType, deviceToken) => {
    let applicationArn = '';
    if ( deviceType === 'android' ){
        applicationArn = SNS.androidPlatformApplicationArn();
    } else if (deviceType === 'ios') {
        applicationArn = SNS.iosPlatformApplicationArn();
    }

    return new promise((resolve, reject) => {
        _SNS.createPlatformEndpoint({
            PlatformApplicationArn: applicationArn,
            Token: deviceToken
        }, (err, data) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(data.EndpointArn);
            }
        });
    });
};

let sendPush = (endPoint, message, messageType, type, senderName, badgeCount, resourceId, status) => {
    winston.info('sending push to', endPoint);

    let data = {
        alert: message,
        sound: 'default',
        badge: badgeCount,
        resource: resourceId,
        type: type,
        senderName: senderName
    },
    payload = {
        default: message,
        APNS: {
            aps: data
        },
        APNS_SANDBOX: {
            aps: data
        },
        GCM: {
            data: data
        }
    };
    
    payload.APNS = JSON.stringify(payload.APNS);
    payload.APNS_SANDBOX = JSON.stringify(payload.APNS_SANDBOX);
    payload.GCM = JSON.stringify(payload.GCM);
    payload = JSON.stringify(payload);

    console.log(payload)
    return new promise(resolve => {
        _SNS.publish({
            Message: payload,
            /* required */
            TargetArn: endPoint,
            MessageStructure: 'json'
        }, (err, data) => {
            if (err && err.code === 'EndpointDisabled') {
                // if error remove endPoint
                winston.info('error', err);
            } else if (err) {
                winston.info('error', err);
            } // an error occurred
            else {
                winston.info('success', data);
                return resolve(data);
            }
        });
    });
};

module.exports = {
    generateEndPoint,
    sendPush
};