
'use strict';

const mongoose = require('mongoose'),
    mongoose_timestamps = require('mongoose-timestamp'),
    schema = mongoose.Schema;

let loggerSchema = new schema({
    logType: { type: String, enum: ['info', 'warning', 'error', 'debug', 'notice', 'critical'], required: true },
    priority: { type: String, required: true, enum: ['low', 'normal', 'high', 'critical'] },
    message: { type: String, required: true },
    data: {},
    userType: { type: String, enum: ['user', 'student', 'admin'], required: true },
    userId: { type: String },
    ipAddress: { type: String }
});

loggerSchema.plugin(mongoose_timestamps);
loggerSchema.index({ priority: 1 }, { background: true, name: 'IDX_LOG_PRIORITY' });
loggerSchema.index({ logType: 1 }, { background: true, name: 'IDX_LOG_TYPE' });

module.exports = mongoose.model('Logger', loggerSchema);