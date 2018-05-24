'use strict';

const mongoose = require('mongoose'),
    mongoose_timestamps = require('mongoose-timestamp'),
    bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10,
    schema = mongoose.Schema,
    winston = require('winston');

let basicUserData = {
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String },
    gender: { type: String, enum: config.genderTypes },
    salt: { type: String },
    password: { type: String },
    langPreference: { type: Number },
    sessionId: { type: String, default: '' }

};


/** ************************************************ User Accounts Model ****************************************************/
let userAccount = new schema({
    email: { type: String, required: true, index: { unique: true } },
    isUser: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    userData: basicUserData,
});

userAccount.plugin(mongoose_timestamps);
userAccount.index({ email: 1 }, { background: true, name: 'IDX_USER_NAME' });
/** *************************************************************************************************************************/
userAccount.pre('save', function (next) {
    let user = this;
    if ( user.isModified('userData.password') ) {
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if ( err ) return next(err);

            // hash the password using our new salt
            bcrypt.hash(user.userData.password, salt, (err, hash) => {
                if ( err ) return next(err);

                // override the cleartext password with the hashed one
                user.userData.password = hash;
                user.userData.salt = salt;
                next();
            });
        });
    } else {
        next();
    }
});

userAccount.methods.comparePassword = function (candidatePassword, userType, cb) {
    if ( userType === 'user' || userType === 'admin' ) {
        if ( this.userData.password ) {
            bcrypt.compare(candidatePassword, this.userData.password, (err, isMatch) => {

                if ( err ) {
                    return cb(err);
                }
                cb(null, isMatch);
            });
        } else {
            cb({ msgCode: 5047 });
        }
    } else {
        return cb({ msgCode: 5031 });
    }
};

const userObject = mongoose.model('userAccount', userAccount);

userObject.findOne({ isAdmin: true }).then(userFound => {
    if ( !userFound ) {
        let createUserObject = {
            email: 'admin@admin.com',
            isAdmin: true,
            'userData.firstName': 'Super',
            'userData.lastName': 'Admin',
            'userData.password': 'admin123',
        };

        new userObject(createUserObject).save().then(userCreated => {
            winston.info('Admin User is created successfully.');
        }).catch(err => {
            winston.info(err);
        });
    }
    else {
        winston.info('Admin User already exists.');
    }
});

module.exports = userObject;

