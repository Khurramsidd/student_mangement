const glob = require('glob');
const _ = require('lodash');
const fs = require('fs'),
    winston = require('winston');

winston.info('error messages are loading ...');
let routePath = 'app/modules/**/*.errors.json';
// initialising with common error message objects
let errorObject = {
    '0001': {
        'msg': {
            'EN': 'User does not exist.',
            'FR': 'L\'utilisateur n\'existe pas.'
        }
    },
    '0002': {
        'msg': {
            'EN': 'Incorrect password.',
            'FR': 'Mot de passe incorrect.'
        }
    },
    '0003': {
        'msg': {
            'EN': 'User is not authenticated.',
            'FR': 'L\'utilisateur n\'est pas authentifié.'
        }
    },
    '0004': {
        'msg': {
            'EN': 'User is not authorized to visit the api.',
            'FR': 'L\'utilisateur n\'est pas autorisé à visiter l\'API.'
        }
    }
};

glob.sync(routePath).forEach(function (file) {
    _.extend(errorObject, JSON.parse(fs.readFileSync(file, 'utf-8')));
    winston.info(file + ' is loaded');
});

module.exports = errorObject;
