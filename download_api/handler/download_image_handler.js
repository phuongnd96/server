const express = require('express');
const { productModel, productDetailModel } = require('../../mongo_models/product_model');
const downloadMainImageRoute = express.Router();
const downloadDetailImageRoute=express.Router();
downloadMainImageRoute.use(downloadMainImageRouteHandler);
downloadDetailImageRoute.use(downloadDetailImageRouteHandlers)
async function downloadMainImageRouteHandler(req, res, next) {
    try {
        console.log(req.query);
        const queryResult=await productModel.find({productName:req.query.productName});
        if (!queryResult.length){
            throw new Error("An error occured");
        }
        res.sendFile(queryResult[0].mainImgPath);
    } catch (error) {
        res.send(error.message);
    }
};
async function downloadDetailImageRouteHandlers(req,res,next){
    try {
    const queryResult=await productDetailModel.find({productName:req.query.productName});
    console.log(queryResult);
    if (queryResult[0].detailImgPath.length<req.query.id){
        throw new Error("An error occured");
    }
    res.sendFile(queryResult[0].detailImgPath[`${req.query.id}`])
    } catch (error) {
        res.send(error.message);
    }
}
exports.downloadMainImageRoute = downloadMainImageRoute;
exports.downloadDetailImageRoute=downloadDetailImageRoute;