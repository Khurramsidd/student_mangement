//
// const winston = require('winston'),
//     Agenda = require('agenda'),
//     chalk = require('chalk'),
//     mongoose = require('mongoose'),
//     userAccount = mongoose.model('userAccount'),
//     notifications = require('./notifications');
//
// let agenda = new Agenda({
//     db: {
//         address: config.mongodb.host + config.mongodb.db_name
//     }
// });
//
// agenda.on('ready', () => {
//     winston.info('Agenda Started.');
//     agenda.start();
// });
//
// // Push Notifications Job
// agenda.define('pushNotification', {
//     priority: 'high'
// }, job => {
//     const information = job.attrs.data.notificationInfo,
//         type = job.attrs.data.type;
//
//     let messageType = information.messageType || '',
//         userId = information.userId || '123',
//         userType = information.userType || 'user',
//         message = information.message || 'studentManagement',
//         senderName = information.senderName || 'studentManagement',
//         badge = information.badge || 0,
//         resource = (information.resource) ? information.resource : information.resource || '',
//         status = information.statusCase || '';
//
//     winston.info(chalk.green('Agenda triggered for General notification for user: ' + userId));
//
//     userAccount.findOne({ _id: userId }).then(account => {
//         let snsToken = '',
//         sessionId = '';
//         if ( account && userType === 'user' ) {
//             if(account.userData){
//                 snsToken = account.userData.snsToken;
//                 sessionId = account.userData.sessionId;
//             }
//         } else  if ( account && userType === 'student' ) {
//             if(account.spData){
//                 snsToken = account.spData.snsToken;
//                 sessionId = account.spData.sessionId;
//             }
//         }
//
//         if ( account && snsToken && sessionId ) {
//             notifications.sendPush(snsToken, message, messageType, messageType, senderName, badge, resource, status);
//         }
//     });
// });
//
// agenda.on('success:pushNotification', job => {
//     winston.info(chalk.green('push sending success to ' + job.attrs.data.notificationInfo.userId));
//     job.remove();
// });
//
// agenda.on('fail:pushNotification', job => {
//     winston.info(chalk.red('Push sending failed to user ' + job.attrs.data.notificationInfo.userId));
// });