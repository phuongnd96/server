const express = require('express');
const getProductTypeRoute = express.Router();
getProductTypeRoute.use(getProductTypeRouteHandler);
const pid = process.pid;
const productModel = require('../../mongo_models/product_model').productModel;
async function getProductTypeRouteHandler(req, res, next) {
    try {
        let productTypeList = [];
        const productList = await productModel.find();
        productList.forEach((product) => {
            if (!productTypeList.includes(product.productType)) {
                productTypeList.push(product.productType);
            }
        });
        res.send(productTypeList)
    } catch (error) {
        res.send(error)
    }


}
exports.getProductTypeRoute = getProductTypeRoute;