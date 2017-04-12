'use strict';

const exec = require('child_process').exec;

module.exports.hello = (event, context, callback) => {
  // simulate the following:
  // [lambda cloud watch cron] - script [project name on Circle] [branch] [Circle token]
  // 30 0 * * * /bin/bash /home/ubuntu/fxa-upt/nightly-check.sh vladikoff/fxa-deps-updates master $(cat /home/ubuntu/.circle_token) 2>&1 | /usr/bin/logger

  const project = process.env.CIRCLE_REPO || '';
  const branch = process.env.CIRCLE_BRANCH || '';
  const token = process.env.CIRCLE_TOKEN || '';
  const cmd = './nightly-check.sh ' + project + ' ' + branch  + ' ' + token;

  console.log('Running ' + cmd);
  exec(cmd, (error, stdout, stderr) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Function executed',
        stdout: stdout,
        stderr: stderr,
        error: error,
        input: event,
      }),
    };

    console.log(response);
    callback(null, response);
  });
};
