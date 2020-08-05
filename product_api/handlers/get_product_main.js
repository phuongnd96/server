const express = require('express');
const getProductRoute = express.Router();
getProductRoute.use(getProductRouteHandler);
const productModel = require('../../mongo_models/product_model').productModel;
async function getProductRouteHandler(req, res, next) {
    try {
        console.log(req.query);
        let perPage = req.query.limit;
        let begin = (req.query.page - 1) * perPage;
        let end = (req.query.page - 1) * perPage + perPage;
        let query = await productModel.find();
        let result = query.slice(begin, end);
        console.log(result)
        result = result.map((elem) => {
            elem = elem.toJSON();
            return ({
                ...elem,
                "link": `/assets/main?productName=${elem.productName}`
            })
        })
        console.log(result)
        res.send(result);
        next();
    } catch (error) {
        res.send(error.message);
    }
}
exports.getProductRoute = getProductRoute;