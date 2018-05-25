const
    mongoose = require('mongoose'),
    userAccount = mongoose.model('userAccount');

let queryUser = (queryObject, projectObject) => {
    return userAccount.findOne(queryObject, projectObject).lean().then(userFound => {
        return userFound;
    }).catch(err => {
        return;
    });
};

let generateAccountResponse = (user, userType) => {
    if (userType === 'user') {
        return {
            id: user._id,
            firstName: user.userData.firstName || '',
            lastName: user.userData.lastName || '',
            email: user.email,
            userType: userType,
            langPreference: user.userData.langPreference,
            facebookId: user.userData.facebookId,
            facebookEmailUpdate: user.userData.facebookEmailUpdate,
            facebookPasswordUpdate: user.userData.facebookPasswordUpdate,
        };
    } else {
        return;
    }
};

let findAndUpdateUserAccount = (queryObject, updatedObj, newDoc) => {
    return userAccount.findOneAndUpdate(queryObject, {$set: updatedObj}, newDoc).then(updatedUser => {
        return updatedUser;
    }).catch(err => {
        return;
    });
};

let enForceSingleSession = (req, res, next) => {
    let userType = req.body.userType;
    return queryUser({_id: req.user._id}).then(acct => {
        if (!acct) {
            return next({msgCode: 5043});
        }
        if (userType === 'user' && !acct.isUser) {
            return next({msgCode: 5050});
        }


        let sessionId = acct.userData.sessionId || '';

        if (sessionId !== req.sessionID) {
            delete req.session[sessionId];
            req.sessionStore.destroy(sessionId, err => {
                if (err) {
                    return next({msgCode: 5127});
                }
                let updatedObj = {};
                if (userType === 'user') {
                    updatedObj = {'userData.sessionId': req.sessionID};
                }
                return findAndUpdateUserAccount({_id: req.user._id}, updatedObj, {new: true}).then(updatedUser => {
                    if (!updatedUser) {
                        return next({msgCode: 5128});
                    }
                    return next();
                });
            });
        } else {
            return next();
        }
    });
};

let isAllowedToAddPassword = (req, res, next) => {
    let userType = req.body.userType;

    return queryUser({$and: [{'userData.facebookId': req.body.facebookId}, {'userData.facebookPasswordUpdate': true}]}).then(userFound => {
        if (!userFound) {
            return next({msgCode: 5122});
        }
        if (userType === 'user') {
            if (userFound.userData.facebookEmailUpdate) {
                if (req.body.email) {
                    return next();
                } else {
                    return next({msgCode: 5000});
                }
            } else {
                if (req.body.email) {
                    return next({msgCode: 5131});
                } else {
                    return next();
                }
            }
        }
    }).catch(err => {
        return next({msgCode: 5090});
    });
};

module.exports = {
    queryUser,
    generateAccountResponse,
    findAndUpdateUserAccount,
    enForceSingleSession,
    isAllowedToAddPassword
};