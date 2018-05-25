const
    mongoose = require('mongoose'),
    student = mongoose.model('student');

let queryUser = (queryObject, projectObject) => {
    return student.findOne(queryObject, projectObject).lean().then(userFound => {
        return userFound;
    }).catch(err => {
        return;
    });
};


let findAndUpdateStudent = (queryObject, updatedObj, newDoc) => {
    return student.findOneAndUpdate(queryObject, {$set: updatedObj}, newDoc).then(updatedUser => {
        return updatedUser;
    }).catch(err => {
        return;
    });
};

let generateStudentResponse = (student) => {
        return {
            id: student._id,
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            email: student.email,
        };
};

module.exports = {
    queryUser,
    findAndUpdateStudent,
    generateStudentResponse
};