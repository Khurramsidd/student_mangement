const studentMiddleWare = require('../middlewares/student.middleware'),
    studentHelper = require('../controller/helpers/student.helper'),
    studentController = require('../controller/student.controller'),
    commonLib = require('../../globals/global.library'),
    passport = require('../../../../config/passport');

module.exports = (app, version) => {
    /** *************************************************** Common APIs ***************************************************************/
    app.post(version + '/add/student',
        passport.isAuthenticated,
        passport.isAuthorized('user'),
        studentMiddleWare.validateAddStudentParams,
        commonLib.fetchIPAdress,
        studentController.addStudent
    );
    app.post(version + '/edit/student',
        passport.isAuthenticated,
        passport.isAuthorized('user'),
        studentMiddleWare.validateAddStudentParams,
        commonLib.fetchIPAdress,
        studentController.addStudent
    );

};