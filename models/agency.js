const mongoose = require('mongoose')
const Joi = require('joi')

const AgencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    englishName: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        type: String,
        required: true,
        unique: true,     
    }
})

const AgencyModel = mongoose.model('agency',AgencySchema)

const agencyValidation = agency => {
    const schema = {
        name: Joi.string().required(),
        englishName: Joi.string().required(),
        fullname: Joi.string().required(),
        logo: Joi.string().required(),
    }
    return Joi.validate(agency, schema)
}

module.exports = {
    AgencyModel,
    AgencySchema,
    agencyValidation,
}