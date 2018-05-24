const
    passport = require('passport'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    multer = require('../../../../config/multer'),
    pushNotification = require('../../../../config/notifications'),
    responseModule = require('../../../../config/response'),
    commonLib = require('../../globals/global.library'),
    userHelper = require('./helpers/user_accounts.helper'),
    logController = require('../../logger/controller/logging.controller');

let signUpStepOne = (req, res, next) => {
    const email = _.trim(req.body.email).toLowerCase(),
        firstName = _.trim(req.body.firstName),
        lastName = _.trim(req.body.lastName),
        password = _.trim(req.body.password),
        userType = req.body.userType,
        gender = req.body.gender,
        langPreference = req.params.lang === 'fr' ? 2 : 1;


    return commonLib.saltPassword(password, (err, maskedPassword) => {
        if (maskedPassword) {
            let userObj = {
                isUser: true,
                'userData.firstName': firstName,
                'userData.lastName': lastName,
                'userData.langPreference': langPreference,
                'userData.password': maskedPassword.password,
                'userData.salt': maskedPassword.salt,
                'userData.gender': gender
            };
            return userHelper.findAndUpdateUserAccount({email: email}, userObj, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }).then(userCreated => {
                if (userCreated) {
                    req.logIn(userCreated, err => {
                        if (err) {
                            return next({ msgCode: 5055 });
                        }
                        return responseModule.successResponse(res, {
                            success: 1,
                            message: 'User signup completed successfully.',
                            data: userHelper.generateAccountResponse(req.user, userType) || {}
                        });
                    });


                } else {
                    logController.createLog('error', 'high', req.body.email + ' tried to signup but failed ', 'user', 'signup', {err}, req.clientIp);
                    return next({msgCode: 5036});
                }
            }).catch(err => {
                logController.createLog('error', 'high', req.body.email + ' tried to signup but failed ', 'user', 'signup', {err}, req.clientIp);
                return next({msgCode: 5036});
            });
        } else {
            return next({msgCode: 5052});
        }
    });
};
module.exports = {
    signUpStepOne,
};