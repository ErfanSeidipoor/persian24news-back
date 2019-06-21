const mongoose = require('mongoose')
const Joi = require('joi')

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
    },
    agency: {
        type: new mongoose.Schema({
            agencyId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            agencyName: {
                type: String,
                required: true,
            },
            agencyLogo: {
                type: String,
                required: true,
            },
            ref: 'agency',
        }),
        required: true,
    },
    dbDate: {
        type: Date,
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    likes: [new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'user',
        },
        username: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now, 
        },
    })],
    dislikes: [new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'user'
        },
        username: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now, 
        },
    })],
    comments: [new mongoose.Schema({
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'user'
        },
        username: {
            type: String,
            required: true, 
        },
        value: {
            value: String,
            required: true, 
        },
        likes: [new mongoose.Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref:'user'
            },
            username: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now, 
            },
        })],
        dislikes: [new mongoose.Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref:'user'
            },
            username: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now, 
            },
        })],
    })],
})

const NewsModel = mongoose.model('news',NewsSchema)

const newsValidation = news => {
    const schema = {
        title: Joi.string().required(),
        description: Joi.string().min(3).required(),
        agency: {
            agencyId: Joi.objectId().required(),
            agencyName: Joi.string().required(),
            agencyLogo: Joi.string().required(),
        },
        dbDate: Joi.date().required(),
    }
    return Joi.validate(news, schema)
}

module.exports = {
    NewsModel,
    NewsSchema,
    newsValidation,
}