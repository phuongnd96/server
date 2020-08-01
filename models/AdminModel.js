const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    username: { type: String, required: true, trim: true },
    password: { type: String, require: true, trim: true }
});
const AdminModels=mongoose.model('AdminModels',adminSchema);
exports.AdminModels=AdminModels;