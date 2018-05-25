'use strict';

const mongoose = require('mongoose'),
    mongoose_timestamps = require('mongoose-timestamp'),
    schema = mongoose.Schema;

/** ************************************************ User Accounts Model ****************************************************/
let student = new schema({
    email: {type: String, required: true, index: {unique: true}},
    firstName: {type: String},
    lastName: {type: String},
    name: {type: String},
    gender: {type: String, enum: config.genderTypes}
});

student.plugin(mongoose_timestamps);
student.index({email: 1}, {background: true, name: 'IDX_USER_NAME'});


const studentObject = mongoose.model('student', student);


module.exports = studentObject;

