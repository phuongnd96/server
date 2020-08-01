const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../../mongo_models/user_model').userModel;
const registerRoute = express.Router();
registerRoute.use(registerHandler);
async function registerHandler(req, res, next) {
    const user = new userModel({
        username: req.body.username,
        password: req.body.password,
        contact:[
            {
                address:req.body.address,
                phoneNumber:req.body.phoneNumber
            }
        ]
    });
    try {
        const isExisted = await userModel.exists({ username: req.body.username });
        if (!isExisted) {
            await bcrypt.hash(password, 10, function (err, hash) {
                if (err) throw err;
                user.username = username;
                user.password = hash;
                user.save((err, result) => {
                    if (err) throw new Error("Cant save user to mongodb");
                    res.status(201).json({
                        username: username,
                        timeStamp: `${new Date().toISOString()}`
                    });
                });
            });
        }
        else{
            throw new Error("Existed User");
        }
    } catch (error) {
        res.send(error.message);
    }
}

exports.registerRoute = registerRoute;