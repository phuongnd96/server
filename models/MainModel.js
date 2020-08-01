const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MainSchema = new Schema({
    id: {type:String,unique:true},
    color: { type: String },
    mainImagePath: { type: String },
});
const MainModel = mongoose.model('MainModel', MainSchema);
exports.MainModel = MainModel;