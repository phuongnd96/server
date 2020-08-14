const express = require('express');
const { productModel } = require('../../mongo_models/product_model');
const { BillModels } = require('../../mongo_models/bill_model');
const paymentRoute = express.Router();
const pid = process.pid;
paymentRoute.use(paymentRouteHandler);
async function paymentRouteHandler(req, res, next) {
    try {
        let now = new Date();
        if (!req.body.name) {
            throw new Error("name is required");
        }
        if (!req.body.phone) {
            throw new Error("phone is required");
        }
        if (!req.body.address) {
            throw new Error("address is required");
        }
        if (!req.body.products) {
            throw new Error("product is required");
        }
        const data = new BillModels({
            billId: `${req.body.name}${req.body.phone}${now.toISOString()}`
            , name: req.body.name
            , phone: req.body.phone
            , email: req.body.email
            , address: req.body.address
            , isPaid: false
            , purchaseDate: `${now.toISOString()}`
            , paidDate: null
            , products: eval(req.body.products)
        });
        let result = await data.save();
        let products = eval(req.body.products);
        products.forEach(async product => {
            const query = await productModel.findOne({ productName: product.productName });
            await productModel.findOneAndUpdate({ productName: product.productName }, { inStock: query.inStock - 1 }, { new: true });
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }

}
exports.paymentRoute = paymentRoute;