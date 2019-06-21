const mongoose = require('mongoose');
const logger = require('../logger');
const config = require('config');

module.exports = () => {
    mongoose
        .connect(
            config.get('db.address'),
            {
                useNewUrlParser: true,
                useCreateIndex: true,
             }
        )
        .then( ()=>{
            logger.info('Connected to mongoDB ...')
        })
}
