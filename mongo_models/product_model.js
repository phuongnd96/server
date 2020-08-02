const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    productName: String,
    productType: String,
    price: Number,
    inStock: Number,
    description: String,
    ratings: [
        { type: Number }
    ],
    averageRating: Number,
    mainImgPath: String
});
// productName reference to productSchema
const productDetailSchema = new Schema({
    productName: String,
    detailDescription: String,
    detailImgPath: [String]
})
const productModel = mongoose.model('productModel', productSchema);
const productDetailModel = mongoose.model('productDetailModel', productDetailSchema);
exports.productModel=productModel;
exports.productDetailModel=productDetailModel;
