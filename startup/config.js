const config = require('config');
const logger = require('../logger/index')

module.exports = app => {
    if ( !config.get('db.address')) {
        throw new Error('db.address required ...')
    }
    if ( !config.get('jwt-privateKey')) {
        throw new Error('jwt-privateKey required ...')
    }
}