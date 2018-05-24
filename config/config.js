var glob = require('glob'),
    path = require('path'),
    env = process.env.NODE_ENV || 'development',
    mongoose = require('mongoose'),
    async = require('async'),
    _ = require('lodash'),
    winston = require('winston'),
    fs = require('fs'),
    autoIncrement = require('mongoose-auto-increment');

global.config = {};

module.exports = callback => {

    async.series([
        envCb => {
            // configuring the environment
            glob('config/env/**/*.json', (err, files) => {

                if (err) {
                    return envCb(err);
                }
                else {
                    // picking up the environment file
                    config = require(path.join(__dirname, 'env', env + '.json'));
                    _.extend(config, JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8')));

                    if (!config) {
                        return envCb('error occured while loading config file!');
                    }
                    else {
                        winston.info('loaded config file:', env);

                        var dbURI = config.mongodb.host + config.mongodb.db_name;
                        // make connection with mongodb
                        if (!mongoose.connection.readyState){
                            let connection = mongoose.connect(dbURI);
                            autoIncrement.initialize(connection);
                        } else {
                            return envCb();
                        }


                        // when successfully connected
                        mongoose.connection.on('connected', () => {
                            winston.info('mongoose connection open to ' + dbURI);
                            return envCb();
                        });

                        // if the connection throws an error
                        mongoose.connection.on('error', err => {
                            return envCb(err);
                        });

                        // when the connection is disconnected
                        mongoose.connection.on('disconnected', () => {
                            return envCb('mongoose connection disconnected');
                        });
                    }
                }
            });

        },
        modelsCb => {
            // load all models

            glob('app/modules/**/*.model.js', (err, files) => {
                if (err) {
                    return modelsCb(err);
                }
                else {
                    winston.info('models are loading ...');
                    files.forEach(file => {
                        require(path.join(__dirname, '../', file));
                        winston.info(file, 'is loaded');
                    });
                    require('./agenda');
                    return modelsCb();
                }
            });
        }], err => {
        if (err) {
            return callback(err);
        }
        else {
            return callback();
        }
    });
};