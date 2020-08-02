const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: { type: String, required: true, trim: true },
    password: { type: String, require: true, trim: true },
    contact: [
        {
            address: { type: String },
            phoneNumber:{type:String}
        }
    ],
    role:String
});
const userModel = mongoose.model('userModel', userSchema);
exports.userModel = userModel;