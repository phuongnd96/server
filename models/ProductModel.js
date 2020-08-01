const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema=new Schema({
    productName:{type:String,required:true},
    productType:{type:String},
    description:{type:String},
    price:Number,
    attributes:[{
        color:{type:String},
        imagePath:{type:String}
    }]
})
const ProductModels = mongoose.model('ProductModels', ProductSchema);
exports.ProductModels = ProductModels;