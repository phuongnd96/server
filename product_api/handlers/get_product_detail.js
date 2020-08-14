const express = require('express');
const { productDetailModel } = require('../../mongo_models/product_model');
const getProductDetailRoute = express.Router();
const pid=process.pid;
getProductDetailRoute.use(getProductDetailRouteHandler);
async function getProductDetailRouteHandler(req, res, next) {
    try {
        console.log(`Handled by process ${pid}`);
        let queryResult = await productDetailModel.find({ productName: req.query.productName });
        if (!queryResult.length) {
            throw new Error('An error occured.');
        };
        queryResult = queryResult[0].toJSON();
        let link = queryResult.detailImgPath.map((elem) => {
            return `/assets/detail?productName=${queryResult.productName}`
        })
        queryResult = {
            ...queryResult,
            link: link
        }
        res.send(queryResult);
    } catch (error) {
        res.send(error.message);
    }
}

exports.getProductDetailRoute = getProductDetailRoute;