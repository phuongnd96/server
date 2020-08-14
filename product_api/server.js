const express = require('express');
const mongoose = require('mongoose');
const PORT = process.argv[2] || process.env.PORT;
const app = express();
const cors = require('cors');
const pid = process.pid;
const bodyParser = require('body-parser');
const { response } = require('express');
const dotenv = require('dotenv').config();
const getProductRoute = require('./handlers/get_product_main').getProductRoute;
const getProductDetailRoute = require('./handlers/get_product_detail').getProductDetailRoute;
const {getProductTypeRoute}=require('./handlers/get_product_type');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
try {
    (async () => {
        mongoose.connect(process.env.MONGO_URL,
            { useNewUrlParser: true }, (err) => {
                if (err) throw err;
                console.log('Success');
            })
    })();
} catch (error) {
    console.log(error.message)
};

app.get("/test", (req, res, next) => {
    for (let i = 0; i < 1e7; i++);
    res.send(`Handled by process: ${pid}`)
})
app.get("/product", (req, res, next) => {
    getProductRoute(req, res, next);
})
app.get("/detail", (req, res, next) => {
    getProductDetailRoute(req, res, next);
})
app.get("/productType",(req,res,next)=>{
    getProductTypeRoute(req,res,next);
})

app.listen(PORT, () => {
    console.log(`product service is listening on PORT ${PORT}`);
})