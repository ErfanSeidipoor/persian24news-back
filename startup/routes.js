const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const userRouter = require('../routes/user')
const authRouter = require('../routes/auth')
const userTagRouter = require('../routes/user.tag')

const error = require('../middleware/error')

module.exports = app =>{

    app.use(express.json());
    app.use(helmet())

    if (app.get('env')==="development")
        app.use(morgan('tiny'))

    app.use('/api/user/tag', userTagRouter)
    app.use('/api/user/', userRouter)
    app.use('/api/auth/', authRouter)

    app.use(error)
}
