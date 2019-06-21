const Joi = require('joi')
const router = require('express').Router();
const bcrypt = require('bcrypt');

const { UserModel, userValidation } = require('../models/user')
const validateBodyMiddleware = require('../middleware/validateBody')

router.post('/', validateBodyMiddleware(userValidation), async (req,res)=>{

    let user = await UserModel.findOne({username: req.body.username })
    if (!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password,user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')

    return res.send({"x-auth-token":user.generateAuthToken()})
})

module.exports = router;