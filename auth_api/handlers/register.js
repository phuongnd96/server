const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../../mongo_models/user_model').userModel;
const registerRoute = express.Router();
const bodyParser = require('body-parser')
registerRoute.use(bodyParser.urlencoded({ extended: true }))
registerRoute.use(registerHandler);
async function registerHandler(req, res, next) {
    try {
        if (!req.body || req.body == undefined) {
            throw new Error("request body is empty")
        }
        const username = req.body.username;
        const password = req.body.password;
        const user = new userModel({
            username: username,
            password: password,
            contact: [
                {
                    address: req.body.address,
                    phoneNumber: req.body.phoneNumber
                }
            ],
            role: "admin"
        });
        const isExisted = await userModel.exists({ username: req.body.username });
        if (!isExisted) {
            await bcrypt.hash(password, 10, async (err, hash) => {
                // Store hashed password to DB.
                if (err) throw err;
                user.username = username;
                user.password = hash;
                const saved = await user.save();
                if (err) throw err;
                res.status(201).json({
                    username: saved.username,
                    timeStamp: `${new Date().toISOString()}`
                });
            });
        }
        else {
            throw new Error("Existed User");
        }
    } catch (error) {
        res.send(error.message);
    }
}
exports.registerRoute = registerRoute;