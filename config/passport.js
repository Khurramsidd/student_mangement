const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookTokenStrategy = require('passport-facebook-token'),
    mongoose = require('mongoose'),
    userAccount = mongoose.model('userAccount'),
    userHelper = require('../app/modules/userAccounts/controller/helpers/user_accounts.helper'),
    randomstring = require('randomstring'),
    path = require('path'),
    env = process.env.NODE_ENV || 'development',
    _ = require('lodash'),
    config = require(path.join(__dirname, 'env', env + '.json'));

// Local Login Strategy
passport.use('user', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (username, password, done) => {
        userAccount.findOne({ email: username.toLowerCase() }, (err, user) => {
            if ( err ) {
                return done(err);
            }
            if ( !user ) {
                return done(null, false, { msgCode: '0001' });
            }
            user.comparePassword(password, 'user', (err, isMatch) => {
                if ( err ) {
                    return done(err);
                }
                if ( !isMatch ) {
                    return done(null, false, { msgCode: '0002' });
                }
                return done(null, user);
            });
        });
    }
));
passport.use('admin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (username, password, done) => {
        userAccount.findOne({ email: username.toLowerCase() }, (err, user) => {
            if ( err ) {
                return done(err);
            }
            if ( !user ) {
                return done(null, false, { msgCode: '0002' });
            }
            user.comparePassword(password, 'user', (err, isMatch) => {
                if ( err ) {
                    return done(err);
                }
                if ( !isMatch ) {
                    return done(null, false, { msgCode: '0002' });
                }
                return done(null, user);
            });
        });
    }
));

passport.use('student', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (username, password, done) => {
        userAccount.findOne({ email: username.toLowerCase() }, (err, user) => {
            if ( err ) {
                return done(err);
            }
            if ( !user ) {
                return done(null, false, { msgCode: '0001' });
            }
            user.comparePassword(password, 'sp', (err, isMatch) => {
                if ( err ) {
                    return done(err);
                }
                if ( !isMatch ) {
                    return done(null, false, { msgCode: '0002' });
                }
                return done(null, user);
            });
        });
    }
));

// Facebook Login Strategy
passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret,
        profileFields: [ 'emails', 'name', 'id' ],
        passReqToCallback: true
    },
    function (req, token, refreshToken, profile, done) {
        try {
            process.nextTick(function () {
                if ( profile.emails[ 0 ].value ) {
                    let email = profile.emails[ 0 ].value.toLowerCase();
                    userAccount.findOne({ $or: [ { 'userData.facebookId': profile.id }, { email: email } ] }, function (err, user) {
                        if ( err )
                            return done({ msgCode: 5108 });
                        if ( user ) {
                            if ( !user.isFacebookAccount ) {
                                let filter = { _id: user._id };
                                let updatedFields = {
                                    $set: {
                                        facebookId: profile.id,
                                        facebookToken: token,
                                        isFacebookAccount: true
                                    }
                                };
                                userAccount.findOneAndUpdate(filter, updatedFields, { new: true }, (err, updateUser) => {
                                    if ( err ) return done({ msgCode: 5108 });
                                    return done(null, updateUser);
                                });
                            } else {
                                return done(null, user);
                            }
                        } else {
                            let newUser = {
                                isUser: true,
                                'userData.facebookId': profile.id,
                                'userData.facebookToken': token,
                                'userData.firstName': profile.name.givenName,
                                'userData.lastName': profile.name.familyName,
                                'userData.isFacebookAccount': true,
                                'userData.phoneNumber': '',
                                'userData.facebookPasswordUpdate': true
                            }, email = (profile.emails[ 0 ].value || '').toLowerCase();

                            return userHelper.findAndUpdateUserAccount({ email: email }, newUser, {
                                upsert: true,
                                new: true
                            }).then(userCreated => {
                                if ( userCreated ) {
                                    return done(null, userCreated);
                                } else {
                                    return done({ msgCode: 5108 });
                                }
                            }).catch(err => {
                                return next({ msgCode: 5108 });
                            });
                        }
                    });
                } else {
                    userAccount.findOne({ 'userData.facebookId': profile.id }, function (err, user) {
                        if ( err )
                            return done({ msgCode: 5108 });
                        if ( user ) {
                            return done(null, user);
                        } else {
                            let newUser = {
                                isUser: true,
                                'userData.facebookId': profile.id,
                                'userData.facebookToken': token,
                                'userData.firstName': profile.name.givenName,
                                'userData.lastName': profile.name.familyName,
                                'userData.isFacebookAccount': true,
                                'userData.phoneNumber': '',
                                'userData.facebookEmailUpdate': true,
                                'userData.facebookPasswordUpdate': true
                            }, email = (profile.emails[ 0 ].value || randomstring.generate(7) + '@dummy.com').toLowerCase();

                            return userHelper.findAndUpdateUserAccount({ email: email }, newUser, {
                                upsert: true,
                                new: true
                            }).then(userCreated => {
                                if ( userCreated ) {
                                    return done(null, userCreated);
                                } else {
                                    return done({ msgCode: 5108 });
                                }
                            }).catch(err => {
                                return next({ msgCode: 5108 });
                            });
                        }
                    });
                }
            });
        } catch ( err ) {
            return done({ msgCode: 5108 });
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    userAccount.findById(_id, (err, user) => {
        if ( err || !user ) {
            done(err, null);
        } else {
            done(err, {
                _id: user._id,
                email: user.email,
                userData: user.userData,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                isUser: user.isUser,
            });
        }
    });
});

// passport middleware
passport.isAuthenticated = (req, res, next) => {
    if ( req.isAuthenticated() ) {
        return next();
    }
    return next({ msgCode: '0003' });
};
passport.isAuthenticatedAdmin = (req, res, next) => {
    if ( req.isAuthenticated() ) {
        return next();
    }

    return res.json({
        success: 0,
        response: 304,
        message: 'User not authenticated.',
        data: {},
    });
};


passport.isAuthorized = userType => {
    return (req, res, next) => {
        let sessionId = req.sessionID;
        if (userType === 'user'){
            if (req.user.userData.sessionId === sessionId){
                return next();
            } else {
               return next({ msgCode: '0004' });
            }
        } else if (userType === 'student'){
           if (req.user.studentData.sessionId === sessionId){
                return next();
            } else {
               return next({ msgCode: '0004' });
            }
        } else if (userType === 'admin'){
            if (req.user.isAdmin){
                return next();
            } else {
                return next({ msgCode: '0004' });
            }
        }
        return next({ msgCode: '0004' });
    };
};


module.exports = passport;
