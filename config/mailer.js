const winston = require('winston'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path');

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let transporter = nodemailer.createTransport(config.mailer.options);

var sendEmail = function (receiverEmail, subject, templateData, template, directory, cb) {
    let rootPath = path.normalize(__dirname + '/..');
    var templateDir = path.join(rootPath, 'app', 'modules', directory, 'templates', 'email', template);

    fs.lstat(templateDir, function (err, stats) {
        if (err || !stats.isDirectory()) {
            winston.log('error', err);
            return cb(err);
        }

        var testTemplate = new EmailTemplate(templateDir);
        var receivers = '';
        if (templateData.name)
            receivers = templateData.name + ' <' + receiverEmail + '>';
        else
            receivers = '<' + receiverEmail + '>';

        testTemplate.render(templateData || {}).then(function (result) {
            var mailOptions = {
                from: 'PamperMoi <info@pampermoi.com>', // sender address
                to: receivers, // list of receivers
                subject: subject, // Subject line
                text: result.text, // plaintext body
                html: result.html, // html body
            };

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    winston.log('error', err);
                    return cb(err);
                }
                else {
                    winston.info('Email sent: ' + info.response);
                    return cb();
                }
            });

        }).catch(function (err) {
            winston.log('error', err);
            return cb(err);
        });

    });

};

exports.transporter = transporter;

exports.sendEmailer = sendEmail;