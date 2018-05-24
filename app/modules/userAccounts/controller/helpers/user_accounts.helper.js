const randomize = require('randomatic'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    userAccount = mongoose.model('userAccount'),
    commonLib = require('../../../globals/global.library');

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
            langPreference: user.userData.langPreference
            /*  facebookId: user.userData.facebookId,
              facebookEmailUpdate: user.userData.facebookEmailUpdate,
              facebookPasswordUpdate: user.userData.facebookPasswordUpdate,*/
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

module.exports = {
    queryUser,
    generateAccountResponse,
    findAndUpdateUserAccount
};