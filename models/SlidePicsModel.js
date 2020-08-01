const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SlideSchema = new Schema({
    id: {type:String,unique:true},
    slidePicsImagePath: String,
});
const SlideModel = mongoose.model('SlideModel', SlideSchema);
exports.SlideModel = SlideModel;