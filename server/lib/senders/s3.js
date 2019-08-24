const AWS = require('aws-sdk');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  AWS.config.update({
    accessKeyId: config('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config('AWS_SECRET_KEY'),
    region: config('AWS_REGION')
  });

  const s3Opts = {
    bucket: config('S3_BUCKET_NAME'),
    token: null
  };

  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to S3...`);

    const options = {
      ACL: 'private',
      Body: JSON.stringify(log),
      Bucket: s3Opts.bucket,
      Key: new Date().getTime()
    };

    s3.putLogEvents(options,
      (err, result) => {
        callback(err, result);
      });
  };
};
