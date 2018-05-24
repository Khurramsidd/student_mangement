
const mongoose = require('mongoose'),
    Logger = mongoose.model('Logger'),
    winston = require('winston');

let createLog = (logType, priority, message, userType, userId, data, ipAddress, cb) => {
    let newLog = {
        logType: logType,
        priority: priority,
        message: message,
        data: data,
        userType: userType,
        userId: userId,
        ipAddress: ipAddress
    };

    const log = new Logger(newLog);

    log.save((err) => {
        if (err) {
            winston.error(err);
            return cb(err);
        }
        return cb;
    });
};

module.exports = {
    createLog
};