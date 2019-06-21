const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    tags :[{
        tagId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'tag'
        },
        tagValue: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }],
    likes:[{
        newsId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'news',
        },
        newsTitle: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        likeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    }],
    dislikes:[{
        newsId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'news',
        },
        newsTitle: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        dislikeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    }],
    comments:[new mongoose.Schema({
        newsId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'news',
        },
        newsTitle: {
            type: String,
            required: true,
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        commentValue: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    })],
    commentlikes:[new mongoose.Schema({
        likeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        newsId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'news',
        },
        newsTitle: {
            type: String,
            required: true,
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        commentValue: {
            type: String,
            required: true,
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'user',
        },
        username:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    })],
    commentDislikes:[new mongoose.Schema({
        dislikeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        newsId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'news',
        },
        newsTitle: {
            type: String,
            required: true,
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        commentValue: {
            type: String,
            required: true,
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'user',
        },
        username:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    })],
})


UserSchema.static.lookup = function() {

}

// its instanse methods not a static method
UserSchema.methods.generateAuthToken = function() {
    return jwt
        .sign(
            {
                _id: this._id,
                isAdmin: this.isAdmin,
                date: new Date(),
            },
            config.get('jwt-privateKey')
        )
}

const UserModel = mongoose.model('user',UserSchema)

const userValidation = user => {
    const schema = {
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    }
    return Joi.validate(user,schema)
}

module.exports = {
    UserModel,
    UserSchema,
    userValidation,
}