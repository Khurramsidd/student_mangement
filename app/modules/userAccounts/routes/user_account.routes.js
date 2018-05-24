const userMiddleWare = require('../middlewares/user_accounts.middleware'),
    userHelper = require('../controller/helpers/user_accounts.helper'),
    userController = require('../controller/user_accounts.controller'),
    commonLib = require('../../globals/global.library'),
    passport = require('../../../../config/passport');

module.exports = (app, version) => {
    /** *************************************************** Common APIs ***************************************************************/
    app.post(
        version + '/signup',
        userMiddleWare.validateSignupParams,
        commonLib.fetchIPAdress,
        userController.signUpStepOne

    );
}