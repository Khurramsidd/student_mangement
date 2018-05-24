const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    expressValidator = require('express-validator'),
    _ = require('lodash'),
    mongoStore = require('connect-mongo')(session),
    http = require('http'),
    chalk = require('chalk'),
    moment = require('moment'),
    validUrl = require('valid-url'),
    country = require('countrystatesjs'),
    winston = require('winston');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        return {
            param: param,
            message: msg,
            value: value
        };
    },
    customValidators: {
        isNumber: value => {
            return _.isNumber(value);
        },
        isArray: value => {
            return Array.isArray(value);
        },
        isNumArray: array => {
            let isNum = true;
            array.map(value => {
                if (!_.isNumber(value)) isNum = false;
            });
            return isNum;
        },
        isValidPercentage: value => {
            return (value >= 0 && value <= 100);
        },
        arrayElemNotDuplicated: array => {
            if (array && array.length > 1) {
                let values = _.filter(array, (value, index, iteratee) => {
                    return _.includes(iteratee, value, index + 1);
                });

                if (values.length) return false;
                else return true;
            }
            else {
                return true;
            }
        },
        arrayIsNotEmpty: array => {
            if (array && array.length >= 1) {
                return true;
            } else {
                return false;
            }
        },
        isPasswordValid: value => {
            if (value.length < 8) {
                return false;
            }
            else {
                return true;
            }
        },
        // isPasswordValid: (value) => /^(?=.*\d).{8,}$/.test(value),
        isUserIdValid: value => {
            return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value) ||
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        },
        isDeviceTypeValid: value => {
            return value == config.deviceTypes[0] || value == config.deviceTypes[1];
        },
        isUserTypeValid: value => {
            return value == config.userTypes[0] || value == config.userTypes[1];
        },
        isPhoneNumberValid: value => {
            let regex = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

            return /^((\+92)|(0092)|(92))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(value) || regex.test(value);
        },
        isLatLongValid: value => /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/.test(value),
        nonNegative: value => value >= 0,
        isValidDateAndTime: value => {
            return moment(value).isValid();
        },
        isValidDate: dateObj => {
            return moment(dateObj).isValid();
        },
        isValidEmailOrPhone: value => {
            if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)) {
                return true;
            } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                return true;
            } else {
                return false;
            }
        },
        isValidCurrentOrFutureDate: value => {
            let date = moment(value);
            let currentDate = moment().unix();
            return moment(date).isAfter(currentDate);
        },
        isValidEmail: value => {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        },
        isValidObjectId: value => {
            let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

            if (checkForHexRegExp.test(value)) {
                return true;
            }
            else {
                return false;
            }
        },
        isValidDeviceType: value => {
            if (value === 'android' || value === 'ios' || value === 'web') {
                return true;
            }
            else {
                return false;
            }
        },
        isValidWhoWillValue: value => {
            value = parseInt(value);
            if (value === 1 || value === 2 || value === 3) {
                return true;
            }
            else {
                return false;
            }
        },
        isMessageContainsContent: value => {
            if (value.length > 0) {
                return true;
            }
            else {
                return false;
            }
        },
        isValidGenderType: value => {
            if ((config.genderTypes.indexOf(value) > -1)) {
                return true;
            } else {
                return false;
            }
        },
        isValidUrl: value => {
            if (value) {
                if (validUrl.isUri(value)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        validateAge: value => {
            if (value) {
                let years = moment().diff(value, 'years');
                if (years >= 18) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        isValidStateOfCanada: stateName => {
            let statesArr = country.states('CA'),
                stateFound = statesArr.find(state => (state.abbreviation === stateName));
            return stateFound;
        },
        isValidName: name => {
            let regex = /^[a-zA-Z ]{2,30}$/;
            if (regex.test(name)) {
                return true;
            }
            else {
                return false;
            }
        },
        isValidDistanceArea: value => {
            if (value) {
                if (value > -1 && value < 100) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        isValidImageIndex: value => {
            if (value && (value > -1 && value <= 5)) {
                return true;
            } else {
                return false;
            }
        },
        isValidTimePeriod: value => {
            if ((config.timePeriod.indexOf(value.toLowerCase()) > -1)) {
                return true;
            } else {
                return false;
            }
        },
        isValidSlotMinutes: minutes => {
            if (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45) {
                return true;
            } else {
                return false;
            }
        },
        isValidSlotAvailability: minutes => {
            if ( minutes === 30 || minutes === 45) {
                return true;
            } else {
                return false;
            }
        },
        isBoolean: function (value) {
            return _.isBoolean(value);
        },
        isValidCurrentOrFutureUnixTimeStamp: value => {
   			return (value + 30) - moment().unix() > 0; //Adding 30 sec
        }
    }
}));

require('./config')(err => {
    if (err) {
        winston.error(err);
    } else {
        // Normalize a port into a number, string, or false.
        function normalizePort (val) {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                return port;
            }

            return false;
        }

        /**
         * Event listener for HTTP server "error" event.
         */

        function onError (error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        /**
         * Event listener for HTTP server "listening" event.
         */

        function onListening () {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            console.log(chalk.bold.green('Server is listening on', bind));
        }

        // Create HTTP server.
        var server = http.createServer(app);

        /**
         * Get port from environment and store in Express.
         */
        var port = normalizePort(config.PORT || '3000');

        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);

        // CORS middleware
        const allowCrossDomain = (req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://editor2.swagger.io');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', true);
            next();
        };
        app.use(allowCrossDomain);
        app.use((req, res, next) => {
            if (req.method === 'OPTIONS') {
                console.log('!OPTIONS');
                var headers = {};
                // IE8 does not allow domains to be specified, just the *
                // headers["Access-Control-Allow-Origin"] = req.headers.origin;
                headers['Access-Control-Allow-Origin'] = 'http://editor2.swagger.io';
                headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
                headers['Access-Control-Allow-Credentials'] = true;
                // headers["Access-Control-Max-Age"] = '86400'; // 24 hours
                headers['Access-Control-Allow-Headers'] = 'Content-Type';
                res.writeHead(200, headers);
                res.end();
            } else {
                return next();
            }
        });
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, '../public')));
        app.use(session({
            secret: config.session.secret,
            store: new mongoStore(
                { url: config.mongodb.host + config.mongodb.db_name, ttl: 14 * 24 * 60 * 60 }
            ),
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 100 * 24 * 3600 * 1000,
                httpOnly: true,
            }
        }));
        app.use(flash());

        var passport = require('./passport');
        app.use(passport.initialize());
        app.use(passport.session());

        const errors = require('./errors');
        require('./routes')(app);

        app.get('/admin', (req, res, next) => {
            res.render('index');
        });

        app.get('/admin/*', (req, res, next) => {
            res.render('index');
        });

        // catch 404 and forward to error handler
        app.use((req, res, next) => {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            winston.error(err);
            if (err.message && typeof err.message === 'number') {
                err.msgCode = err.message;
            }

            if (err.name == 'ValidationError') {
                res.json({
                    success: 0,
                    message: err.errors,
                    response: 304,
                    data: {}
                });
            }
            else {
                if (err.msgCode == '0003') {
                    res.status(401);
                    err.status = 401;
                }
                if (err.msgCode == '0004') {
                    res.status(403);
                }

                if (err.status == 404) {
                    res.json({
                        success: 0,
                        message: 'Not Found.',
                        response: 404,
                        data: {}
                    });
                } else if ( err.status == 401 ) {
                    res.json({
                        success: 0,
                        message: errors[ err.msgCode ].msg.EN,
                        response: 400,
                        data: {}
                    });
                } else {
                    if (!err.msgCode) {
                        res.status(500);
                        res.json({
                            success: 0,
                            message: 'Something went wrong. Please try again.',
                            response: 500,
                            data: {}
                        });
                    }
                    else {
                        res.status(200);
                        if (req.url.indexOf('/fr/') >= 0) {
                            res.json({
                                success: 0,
                                message: errors[err.msgCode].msg.FR,
                                response: 400,
                                data: {}
                            });
                        } else {
                            res.json({
                                success: 0,
                                message: errors[err.msgCode].msg.EN,
                                response: 400,
                                data: {}
                            });
                        }
                    }
                }
            }
        });

        // const socketManager = require('./socketIo/socket_connection_handler');
        // socketManager.socketConnectInitialization(server);

        // require('./scheduler');
    }
});

module.exports = app;
