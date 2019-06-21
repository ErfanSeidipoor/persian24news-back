const logger = require('../logger')

module.exports = ()=>{
    process.on('uncaughtException',ex => {
        logger.error(ex.message,ex)      
    })
    process.on('unhandledRejection',ex => {throw ex})
}