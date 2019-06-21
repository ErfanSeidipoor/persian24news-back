const mongoose = require('mongoose')
const Joi = require('joi')

const TagSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
    }
})

const TagModel = mongoose.model('tag',TagSchema)

const tagValidation = tag => {
    const schema = {
        value: Joi.string().required(),
    }
    return Joi.validate(tag,schema)
}

module.exports = {
    TagModel,
    TagSchema,
    tagValidation,
}