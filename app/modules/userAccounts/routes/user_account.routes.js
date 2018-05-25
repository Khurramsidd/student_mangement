const userMiddleWare = require('../middlewares/user_accounts.middleware'),
    userHelper = require('../controller/helpers/user_accounts.helper'),
    userController = require('../controller/user_accounts.controller'),
    commonLib = require('../../globals/global.library'),
    passport = require('../../../../config/passport');

module.exports = (app, version) => {
    /** *************************************************** Common APIs ***************************************************************/
    app.post(version + '/signup',
        userMiddleWare.validateSignupParams,
        commonLib.fetchIPAdress,
        userController.signUpStepOne,
        userHelper.enForceSingleSession,
        userController.signupSuccessResponse
    );
    app.post(version + '/login',
        userMiddleWare.validateLoginParams,
        commonLib.fetchIPAdress,
        userController.accountLogin,
        userHelper.enForceSingleSession,
        userController.loginSuccessResponse
    );
    app.get(version + '/logout',
        passport.isAuthenticated,
        commonLib.fetchIPAdress,
        userController.logoutAccount
    );
    app.post(
        version + '/user/auth/facebook',
        userMiddleWare.facebookLogInValidate,
        userController.facebookLogIn,
        userHelper.enForceSingleSession,
        userController.loginSuccessResponse
    );
    app.post(
        version + '/add/email/password',
        passport.isAuthenticated,
        passport.isAuthorized('user'),
        userMiddleWare.validateUpdateEmailPasswordParams,
        commonLib.fetchIPAdress,
        userHelper.isAllowedToAddPassword,
        userController.updateEmailAndPassword
    );
};