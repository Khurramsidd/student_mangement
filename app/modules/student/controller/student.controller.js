const
    _ = require('lodash'),
    responseModule = require('../../../../config/response'),
    // commonLib = require('../../globals/global.library'),
    studentHelper = require('./helpers/student.helper'),
    logController = require('../../logger/controller/logging.controller');

let addStudent = (req, res, next) => {
    const email = _.trim(req.body.email).toLowerCase(),
        firstName = _.trim(req.body.firstName),
        lastName = _.trim(req.body.lastName),
        name = _.trim(req.body.firstName) + ' ' + _.trim(req.body.lastName),
        gender = req.body.gender;
    let studentObj = {
        'firstName': firstName,
        'lastName': lastName,
        'name': name,
        'gender': gender
    };
    return studentHelper.findAndUpdateStudent({email: email}, studentObj, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }).then(studentCreated => {
        if (studentCreated) {
            responseModule.successResponse(res, {
                success: 1,
                message: 'Student added successfully.',
                data: studentHelper.generateStudentResponse(studentCreated) || {}
            });
        } else {
            logController.createLog('error', 'high', req.user.email + ' tried to add student but failed ', req.user.userData.userType, req.user._id, {err}, req.clientIp);
            return next({msgCode: 6000});
        }
    }).catch(err => {
        logController.createLog('error', 'high', req.body.email + ' tried to add student but failed', req.user.userData.userType, req.user._id, {err}, req.clientIp);
        return next({msgCode: 6000});
    });
};


module.exports = {
    addStudent
};