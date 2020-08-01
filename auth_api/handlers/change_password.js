const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../../mongo_models/user_model').userModel;
const changePasswordRoute = express.Router();
const bodyParser = require('body-parser')
changePasswordRoute.use(bodyParser.urlencoded({ extended: true }))
changePasswordRoute.use(changePasswordRouteHandler);
async function changePasswordRouteHandler(req, res, next) {
    try {
        if (!req.body || req.body == undefined) {
            throw new Error("Request body is empty")
        }
        const queryByUserName = await userModel.findOne({ username: req.body.username });
        if (!queryByUserName) {
            throw new Error("Tên người dùng không tồn tại");
        }
        if (req.body.newPassword != req.body.confirmPassword) {
            throw new Error("Xác nhận mật khẩu không khớp");
        }
        if (req.body.password == req.body.newPassword) {
            throw new Error("Mật khẩu mới phải khác mật khẩu cũ");
        }
        const result = await bcrypt.compare(req.body.password, queryByUserName.password);
        if (!result) {
            throw new Error("Mật khẩu cũ không đúng");
        } else {
            const newPassword = req.body.newPassword;
            await bcrypt.hash(newPassword, 10, async (err, hash) => {
                if (err) throw err;
                queryByUserName.password=hash;
                await queryByUserName.save();
            });
            res.status(200).json({
                "message": "Success"
            })
        }
    } catch (error) {
        res.send(error.message);
    }
};
exports.changePasswordRoute = changePasswordRoute;