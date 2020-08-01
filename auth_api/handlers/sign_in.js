const express = require('express');
const userModel = require('../../mongo_models/user_model').userModel;
const signInRoute = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
signInRoute.use(bodyParser.urlencoded({ extended: true }))
signInRoute.use(signInHandler);
async function signInHandler(req,res,next) {
    try {
        console.log(req.body)
        const queryResult = await userModel.findOne({ username: req.body.username });
        console.log(queryResult)
        if (!queryResult) {
            throw new Error("Tên đăng nhập hoặc mật khẩu sai");
        };
        const result = await bcrypt.compare(req.body.password, queryResult.password);
        const payload = {
            check: true
        };
        console.log(process.env.SECRET_KEY)
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 7776000
        });
        if (result) {
            console.log('Auth success'+`${new Date().toISOString()}`);
            res.status(200).json({
                "message": "authentication sucesss",
                "token": token
            })
        } else {
            res.status(400).json({
                "message": "authentication failed"
            })
        }
    } catch (error) {
        res.send(error.message);
    }
};
exports.signInRoute = signInRoute;
