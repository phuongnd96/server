const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DescriptionSchema = new Schema({
        id: {type:String,unique:true},
        content: String,
        descriptionImagePath: String,
});
const DescriptionModel = mongoose.model('DescriptionModel', DescriptionSchema);
exports.DescriptionModel = DescriptionModel;