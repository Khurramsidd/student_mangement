// const userHelper = require('../controller/helpers/user_accounts.helper'),
const commonLib = require('../../globals/global.library');


let validateSignupParams = (req, res, next) => {
    if (req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    req.assert('email', 5000).notEmpty();
    req.assert('email', 5001).isEmail();
    req.assert('firstName', 5003).notEmpty();
    req.assert('firstName', 5004).isValidName();
    req.assert('lastName', 5005).notEmpty();
    req.assert('lastName', 5006).isValidName();
    req.assert('password', 5007).notEmpty();
    req.assert('password', 5008).isPasswordValid();
    req.assert('userType', 5009).notEmpty();
    req.assert('gender', 5010).notEmpty();
    req.assert('gender', 5011).isValidGenderType();

    commonLib.validationResponse('User could not be signup', req, next);
};



module.exports = {
    validateSignupParams

};
