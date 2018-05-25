const
    passport = require('passport'),
    _ = require('lodash'),
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
                'userData.name' : _.trim(req.body.firstName) + ' ' + _.trim(req.body.lastName),
                'userData.langPreference': langPreference,
                'userData.password': maskedPassword.password,
                'userData.salt': maskedPassword.salt,
                'userData.gender': gender,
                'userData.userType': userType
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
                       next();
                    });


                } else {
                    logController.createLog('error', 'high', req.body.email + ' tried to signup but failed ', userType, 'signup', {err}, req.clientIp);
                    return next({msgCode: 5036});
                }
            }).catch(err => {
                logController.createLog('error', 'high', req.body.email + ' tried to signup but failed ', 'user', userType, {err}, req.clientIp);
                return next({msgCode: 5036});
            });
        } else {
            return next({msgCode: 5052});
        }
    });
};

let accountLogin = (req, res, next) => {
    let userType = req.body.userType;

    passport.authenticate(userType, (err, user, info) => {
        if ( err ) {
            if ( err.msgCode ) {
                return next(err);
            } else {
                return next({ msgCode: 5055 });
            }
        }
        if ( !user ) {
            return next(info);
        }
        req.logIn(user, err => {
            if ( err ) {
                return next({ msgCode: 5055 });
            }
            req.acct = user;
            next();
        });
    })(req, res, next);
};

let loginSuccessResponse = (req, res, next) => {
    logController.createLog('info', 'normal', req.user.email + ' has logged in successfully', req.body.userType, '', {}, req.clientIp);

    responseModule.successResponse(res, {
        success: 1,
        message: 'Account login is completed successfully.',
        data: userHelper.generateAccountResponse(req.user, req.body.userType) || {}
    });
};

let signupSuccessResponse = (req, res, next) => {
    logController.createLog('info', 'normal', req.user.email + ' has sign up successfully', req.body.userType, '', {}, req.clientIp);

   responseModule.successResponse(res, {
        success: 1,
        message: 'User signup completed successfully.',
        data: userHelper.generateAccountResponse(req.user, req.body.userType) || {}
    });
};

let logoutAccount = (req, res, next) => {
    let sessionId = req.sessionID,
        updatedObj = {},
        userType = '',
        userId = req.user._id,
        userEmail = req.user.email;

    if (!req.user) {
        return next({ msgCode: '0004' });
    }

    if (req.user.userData) {
        if (req.user.userData.sessionId === sessionId) {
            updatedObj = { 'userData.sessionId': '' };
            userType = 'user';
        }
    }


    let filter = { _id: req.user._id };
    return userHelper.findAndUpdateUserAccount(filter, updatedObj, { new: true }).then(() => {
        req.session.destroy(err => {
            req.logout();
            req.logOut();
        });

        logController.createLog('info', 'normal', userEmail + ' has logged out successfully', userType || 'user', userId, {}, req.clientIp);
        return responseModule.successResponse(res, {
            success: 1,
            message: 'You have logout successfully.',
            data: {}
        });
    });
};

let facebookLogIn = (req, res, next) => {
    try {
        passport.authenticate('facebook-token', { scope: [ 'email' ] }, (err, user, info) => {
            if ( err ) {
                return next({ msgCode: 5108 });
            }
            if ( !user ) {
                return next(info);
            }

            req.logIn(user, (err) => {
                if ( err ) {
                    return next({ msgCode: 5055 });
                }
                return next();
            });
        })(req, res, next);
    } catch ( err ) {
        return next({ msgCode: 5108 });
    }
};
let updateEmailAndPassword = (req, res, next) => {
    let password = req.body.newPassword,
        userType = req.body.userType,
        updatedObj = {};
    return commonLib.saltPassword(password, (err, maskedPassword) => {
        if ( maskedPassword ) {
            if ( userType === 'user' ) {
                updatedObj = {
                    'userData.password': maskedPassword.password,
                    'userData.salt': maskedPassword.salt,
                    'userData.facebookPasswordUpdate': false,
                };
                if ( req.body.email ) {
                    updatedObj.email = req.body.email;
                    Object.assign(updatedObj, {
                        'userData.facebookEmailUpdate': false
                    });
                }
            }
            return userHelper.findAndUpdateUserAccount({ 'userData.facebookId': req.body.facebookId }, updatedObj, { new: true }).then(updatedUser => {
                if ( !updatedUser ) {
                    return next({ msgCode: 5094 });
                }
                logController.createLog('info', 'normal', req.body.facebookId + ' has reset password successfully', userType, req.user._id, {}, req.clientIp);
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'Facebook Password is updated successfully.',
                    data: {}
                });
            }).catch(err => {
                return next({ msgCode: 5094 });
            });
        } else {
            return next({ msgCode: 5052 });
        }
    });
};

module.exports = {
    signUpStepOne,
    accountLogin,
    loginSuccessResponse,
    signupSuccessResponse,
    logoutAccount,
    facebookLogIn,
    updateEmailAndPassword
};