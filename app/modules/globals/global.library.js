

const async = require('async'),
    bcrypt = require('bcryptjs'),
    moment = require('moment'),
    randomize = require('randomatic'),
    requestIp = require('request-ip'),
    winston = require('winston'),
    SALT_WORK_FACTOR = 10;

let fetchIPAdress = (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);
    req.clientIp = clientIp;
    next();
};

let formatDate = dateTime => {
    return moment.utc(dateTime).format('YYYY-MM-DD');
};

let getUTCDateTime = dateTime => {
    return moment.utc(dateTime, 'YYYY-M-D');
};

let formatHour = hour => {
    return moment({hour: hour}).format('h A');
};

let formatJobDate = dateObj => {
    return moment({date: dateObj.date, month: dateObj.month, year: dateObj.year}).format('D MMMM, YYYY');
};

let formatJobTime = timeObj => {
    return moment({hours: timeObj.hours, minute: timeObj.minute}).format('hh:mm A');
};

let formatJobDateTime = obj => {
    return moment({
        date: obj.date,
        month: obj.month,
        year: obj.year,
        hours: obj.hours,
        minute: obj.minute
    }).format('D MMMM, hh:mm A');
};

let saltPassword = (password, cb) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return cb(err);
        // hash the password using our new salt
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) return cb(err);
            // override the cleartext password with the hashed one
            return cb(null, {
                salt: salt,
                password: hash
            });
        });
    });
};
/*
let sendEmail = (email, body, vars, template, directory) => {
    return new Promise((resolve, reject) => {
        mailer.sendEmailer(email, body, vars, template, directory, err => {
            if (err) {
                return reject(err);
            } else {
                return resolve();
            }
        });
    });
};
let sendSms = (phoneText, phoneNumber, cb) => {
    let smsObject = {
        to: phoneNumber,
        text: phoneText,
    };
    sms.sendMessage(smsObject);
    return cb();
};

let sendEmailAndSms = (vars, phoneText, email, phoneNumber, subject, template, directory, cb) => {
    async.parallel([
        (mailCb) => {
            sendEmail(email, subject, vars, template, directory).then(() => {
                mailCb();
            }).catch(err => {
                mailCb(err);
            });
        },
        (SMSCb) => {
            if (phoneNumber) {
                let smsObject = {
                    to: phoneNumber,
                    text: phoneText,
                };

                sms.sendMessage(smsObject, (err) => {
                    if (err) {
                        return SMSCb();
                    } else {
                        return SMSCb();
                    }
                });
            } else {
                return SMSCb();
            }
        }
    ], err => {
        if (err) {
            return cb({msgCode: 5041});
        } else {
            return cb();
        }
    });
};*/

/* let isValidCanadianPostalAddress = (req, res, next) => {
    let regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (regex.test(req.body.postalCode)) {
        return next();
    } else {
        return next({msgCode: 5034});
    }
};

let sendSocketDataAndNotification = (socketKeyAndNotificationType, socketRoom, userId, userType, notificationMessage, notificationData, resource, callback) => {
    let pushType = 1,
        socket = {resource};

    return socketHelper.getGlobalUserSocket(userId, userType).then(socketConnected => {
        if (socketRoom) {
            socketHelper.emitToRoom(socketRoom, socketKeyAndNotificationType, {socket});
            callback(null);
        } else if (socketConnected) {
            if (socketConnected.socketId !== '' && socketHelper.checkIfSocketConnected(socketConnected.socketId)) {
                socketHelper.emitToSocket(socketKeyAndNotificationType, socketConnected.socketId, userId, userType, {socket});
                return callback(null);
            } else {
                pushJob(userId, notificationMessage, socketKeyAndNotificationType, notificationData, socketKeyAndNotificationType, userType, pushType);
                callback(null);
            }
        } else {
            pushJob(userId, notificationMessage, socketKeyAndNotificationType, notificationData, socketKeyAndNotificationType, userType, pushType);
            callback(null);
        }
    });
};

let pushJob = (userId, message, messageType, resource, statusCase, userType, pushType, cb) => {
    agendaHelper.pushJob({
        userId: userId,
        message: message,
        messageType: messageType,
        resource: resource,
        statusCase: statusCase,
        userType: userType
    }, pushType);
    cb();
};

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

let findDistance = (start, end, decimals = 2, cb) => {
    let earthRadius = 6371, // km
        lat1, lat2, lon1, lon2;

    lat1 = parseFloat(start.lat);
    lat2 = parseFloat(end.lat);
    lon1 = parseFloat(start.long);
    lon2 = parseFloat(end.long);

    dLat = (lat2 - lat1).toRad();
    dLon = (lon2 - lon1).toRad();
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = earthRadius * c;
    return cb(null, (Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals)));
};*/

let validationResponse = (message, req, next) => {
    return req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            let errors = result.array().map(error => {
                return error.message;
            });
            winston.error(message + errors.join(' && '));
            return next({msgCode: errors[0]});
        } else {
            return next();
        }
    });
};

module.exports = {
    fetchIPAdress,
    formatDate,
    getUTCDateTime,
    saltPassword,
  /*  sendEmail,
    sendSms,
    sendEmailAndSms,
    isValidCanadianPostalAddress,
    sendSocketDataAndNotification,
    findDistance,*/
    formatJobDate,
    formatJobTime,
    formatHour,
    validationResponse,
    formatJobDateTime
};