const express = require('express');
const getProductRoute = express.Router();
getProductRoute.use(getProductRouteHandler);
const pid=process.pid;
const productModel = require('../../mongo_models/product_model').productModel;
async function getProductRouteHandler(req, res, next) {
    try {
        // console.log(req.query);
        console.log(`Handled by process ${pid}`);
        let perPage = req.query.limit;
        let begin = (req.query.page - 1) * perPage;
        let end = (req.query.page - 1) * perPage + perPage;
        let productName = req.query.productName;
        let query = "";
        let result = "";
        if (!req.query.productName) {
            // console.log('query all');
            query = await productModel.find();
        } else {
            // console.log('query contains name');
            const regex = new RegExp(`${productName}`, 'gi')
            query = await productModel.find({ productName: regex })
        };
        if (req.query.minPrice) {
            // console.log('1')
            query = query.filter((elem) => {
                return elem.price >= req.query.minPrice
            })
        }
        if (req.query.maxPrice) {
            // console.log('2')
            query = query.filter((elem) => {
                return elem.price <= req.query.maxPrice
            })
        }
        if(req.query.productType){
            query=query.filter((elem)=>{
                return elem.productType===req.query.productType
            })
        }
        result = query.slice(begin, end).map((elem) => {
            elem = elem.toJSON();
            return ({
                ...elem,
                "link": `/assets/main?productName=${elem.productName}`
            })
        })
        // console.log(result)
        res.send(result);
        next();
    } catch (error) {
        res.send(error.message);
    }
}
exports.getProductRoute = getProductRoute;