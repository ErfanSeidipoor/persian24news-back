const router = require('express').Router();
const Joi = require('joi')
const _ = require('lodash')

const { UserModel } = require('../models/user')
const authMiddleware = require('../middleware/auth') 
const adminMiddleware = require('../middleware/admin') 
const validateBodyMiddleware = require('../middleware/validateBody')
const asyncMiddleware = require('../middleware/async')

router.get('/', authMiddleware , asyncMiddleware( async(req,res)=>{

    const id = req.user._id;
    const user = await UserModel
        .findById(id)
        .select('tags')
    if (!user)
        return res.status(404).send("user not found") 
    return res.send(user.tags)
}))

router.get('/:id', authMiddleware , asyncMiddleware( async(req,res)=>{

    const id = req.user._id;
    const user = await UserModel
        .findById(id)
        .select('tags')
    if (!user)
        return res.status(404).send("user not found") 
    return res.send(user.tags)
}))

const addTagBodyValidation = body => 
    Joi.validate(
        body,
        {
            _id: Joi.objectId().required(),
            value: Joi.string().min(2).required(),
        }
    )

router.put('/', authMiddleware , validateBodyMiddleware(addTagBodyValidation), asyncMiddleware( async(req,res)=>{

    const userId = req.user._id;
    const tagId = req.body._id;

    console.log(" userId: ",userId)
    console.log(" tagId: ",tagId)

    // https://stackoverflow.com/questions/26328891/push-value-to-array-if-key-does-not-exist-mongoose

    const user = await UserModel.findByIdAndUpdate(
        userId,
        {
            $push: {
                // tags: _.pick(req.body, ["value","_id"] ),
                tags: {
                    _id: req.body._id,
                    tagId: req.body._id,
                    tagValue: req.body.value,
                }
            }
        },
        {
            new: true
        }
     )
        
    console.log("user : ", user)
    if (!user)
        return res.status(404).send("user not found") 
    return res.send(_.pick(user,['username','_id','tags']))
}))



// PersonModel.update(
//     { _id: person._id }, 
//     { $push: { friends: friend } },
//     done
// );
module.exports = router;