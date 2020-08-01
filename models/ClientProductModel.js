const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClientProductSchema=new Schema({
    id:{unique:true,type:String},
    productName:{type:String,required:true},
    productType:{type:String},
    price:Number
})
const ClientProductModels = mongoose.model('ClientProductModels', ClientProductSchema);
exports.ClientProductModels = ClientProductModels;