const aws = require('aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    fs = require('fs'),
    jimp = require('jimp'),
    winston = require('winston'),
    AWS = require('aws-sdk');

let upload = dirName => {
    const s3 = new aws.S3(config.aws.s3);
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: config.aws.s3.bucket,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            ACL: 'public-read',
            metadata: function (req, file, cb) {
                cb(null, {fieldName: file.fieldname});
            },
            key: function (req, file, cb) {
                var newFileName = dirName + '/' + Date.now() + '-' + file.originalname;
                cb(null, newFileName);
            }
        }),
    });
};

let resizeAndUpload = (imageUrl, imageName) => {

    return new Promise(function (resolve, reject) {
        createTempParentDirectory();

        let resizedFilePath = __dirname + '/../../resized_images/100X100/' + imageName;
        let resizedMediumFilePath = __dirname + '/../../resized_images/300X300/' + imageName;

        createTempDirectory('100X100');
        createTempDirectory('300X300');

        jimp.read(imageUrl).then(imageToResize => {
            imageToResize.resize(100, jimp.AUTO).quality(100).write(resizedFilePath, function () {
                uploadResizedImage(resizedFilePath, config.aws.s3.profileImageResizeDirectory, imageName).then(doneUploading => {
                    fs.unlink(resizedFilePath, function () {
                        winston.info('image resized and uploaded to s3 and deleted from directory');
                    });
                });
            });
        });

        jimp.read(imageUrl).then(imageToResize => {
            imageToResize.resize(300, jimp.AUTO).quality(100).write(resizedMediumFilePath, function () {
                uploadResizedImage(resizedMediumFilePath, config.aws.s3.profileImageMediumResizeDirectory, imageName).then(doneUploading => {
                    fs.unlink(resizedMediumFilePath, function () {
                        winston.info('image medium resized and uploaded to s3 and deleted from directory');
                    });
                });
            });
        });
    });
};


module.exports = {
    upload,
    resizeAndUpload
};

function createTempParentDirectory() {
    if (!fs.existsSync(__dirname + '/../../resized_images/')) {
        fs.mkdirSync(__dirname + '/../../resized_images/');
    }
}

function createTempDirectory(dimensions) {
    if (!fs.existsSync(__dirname + '/../../resized_images/' + dimensions)) {
        fs.mkdirSync(__dirname + '/../../resized_images/' + dimensions);
    }
}


function removeTempParentDirectory() {
    if (fs.existsSync(__dirname + '/../../resized_images/')) {
        fs.rmdirSync(__dirname + '/../../resized_images/');
    }
}

function uploadResizedImage(resizedFilePath, path, fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(resizedFilePath, function (err, data) {
            if (err) {
                reject('Error in resizing images.');
            }
            else {
                AWS.config.update({
                    accessKeyId: config.aws.s3.accessKeyId,
                    secretAccessKey: config.aws.s3.secretAccessKey,
                    region: config.aws.s3.region
                });

                var s3 = new AWS.S3({params: {Bucket: config.aws.s3.bucket}});

                var params = {
                    Key: path + fileName,
                    Body: data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg'
                };

                s3.putObject(params, function (err) {
                    if (err) {
                        winston.log('info', 'error uploading resisezed image to s3');
                        reject('Error in uploading resized images.');
                    } else {
                        winston.log('info', 'resized image upload to s3');
                        resolve();
                    }
                });
            }
        });
    });
}