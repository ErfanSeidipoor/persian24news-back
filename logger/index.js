const winston = require('winston')
// require('winston-mongodb');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    transports: [
      new winston.transports.File({ filename: '.log' }),
      // new winston.transports.MongoDB({db: 'mongodb://localhost/vidly-Project'}),
      new winston.transports.Console({
        format: winston.format.combine()
      })
    ]
});

module.exports = logger;