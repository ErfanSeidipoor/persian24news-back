const router = require('express').Router();
const bcrypt = require('bcrypt')
const _ = require('lodash')

const { UserModel, userValidation } = require('../models/user')
const authMiddleware = require('../middleware/auth') 
const adminMiddleware = require('../middleware/admin') 
const validateBodyMiddleware = require('../middleware/validateBody')
const asyncMiddleware = require('../middleware/async')

router.get('/', authMiddleware, adminMiddleware ,(req,res)=>{
    UserModel
        .find()
        .select('username _id isAdmin tags')
        .sort('username')
        .then(users=>res.send(users))
        .catch(error=>res.status(400).send(error.message))
})

router.get('/me', authMiddleware, asyncMiddleware( async (req,res)=>{
    const id = req.user._id;
    const user = await UserModel
        .findById(id)
        .select('username _id isAdmin tags')

    if (user)
        return res.send(user)
    return res.status(404).send("not found")
}))

router.get('/:id', authMiddleware, adminMiddleware ,(req,res)=>{
    UserModel
        .findById(req.params.id)
        .select('username _id isAdmin tags')
        .sort('username')
        .then(users=>res.send(users))
        .catch(error=>res.status(400).send(error.message))
})

router.post('/', validateBodyMiddleware(userValidation) ,asyncMiddleware( async (req,res)=>{
    
    let user = await UserModel.findOne({ username: req.body.username })
    if (user) return res.status(409).send('User already registered');

    user = _.pick(req.body,['username','password'])

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password,salt)
    user.password = hash

    user = new UserModel(user);
    const tocken = user.generateAuthToken();

    const savedUser = await user.save();
    return res.header('x-auth-token',tocken).send(_.pick(savedUser,['username','isAdmin','_id']))
}))

module.exports = router;