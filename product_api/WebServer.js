const express=require('express');
const mongoose=require('mongoose');
const PORT=process.argv[2] || process.env.PORT;
const app =express();
const cors=require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const getProductRoute=require('./handlers/get_product_main').getProductRoute;
const getProductDetailRoute=require('./handlers/get_product_detail').getProductDetailRoute;
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
app.get("/product",(req,res,next)=>{
    console.log(req.query);
    getProductRoute(req,res,next);
})
app.get("/detail",(req,res,next)=>{
    getProductDetailRoute(req,res,next);
})

app.listen(PORT,()=>{
    console.log(`product service is listening on PORT ${PORT}`);
})