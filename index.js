const express = require('express');
const logger = require('./logger')
const app = express();

require('./startup/unhandleError')()
require('./startup/db')();
require('./startup/production')(app)
require('./startup/routes')(app)
require('./startup/config')(app)
require('./startup/validation')()

const port = process.env.PORT || 3000;

let server;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(port,()=>logger.info(`server running on ${port}`))
}
else {
    server = app.listen()
}

module.exports = server