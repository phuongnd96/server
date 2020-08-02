const express = require('express');
const mongoose = require('mongoose');
const PORT = process.argv[2] || process.env.PORT;
const app = express();
// const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const multer = require('multer');
const productModel = require('../mongo_models/product_model').productModel;
const productDetailModel = require('../mongo_models/product_model').productDetailModel;
const storageMainImageFiles = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/main')
    },
    filename: function (req, file, cb) {
        cb(null, `main${Date.now()}` + path.extname(file.originalname))
    }
});
const uploadMain = multer({ storage: storageMainImageFiles });
const storageDetailImageFiles = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/detail')
    },
    filename: function (req, file, cb) {
        cb(null, `detail${Date.now()}` + path.extname(file.originalname))
    }
});
const uploadDetail = multer({ storage: storageDetailImageFiles });
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
app.post("/admin/upload/add/main", uploadMain.array('mainFile', 1), async (req, res, next) => {
    console.log(req.body);
    try {
        const files = req.files;
        if (!files) {
            throw new Error("File is required");
        }
        if (files.length != 1) {
            throw new Error("You can only upload 1 file");
        }
        const isExisted = await productModel.find({ name: req.body.productName });
        if (isExisted.length) {
            throw new Error("Product name existed");
        }
        const newProduct = new productModel({
            productName: req.body.productName,
            productType: req.body.productType,
            price: req.body.price,
            inStock: req.body.inStock,
            description: req.body.description,
            ratings: [null],
            averageRating: null,
            mainImgPath: `${__dirname}/storage/main/${files[0].filename}`
        });
        await newProduct.save();
        res.send(newProduct);
        next();
    } catch (error) {
        res.send(error.message);
    }
});
app.post("/admin/upload/add/detail", uploadDetail.array('detailFiles', 3), async (req, res, next) => {
    console.log(req.body);
    try {
        const files = req.files;
        if (!files) {
            throw new Error("File is required");
        }
        if (files.length < 1 || files.length > 3) {
            throw new Error("You can only upload from 1 to 3 file");
        }
        const detailImgPath = files.map((file) => {
            return `${__dirname}/storage/detail/${file.filename}`;
        })
        const isValid = await productModel.find({ productName: req.body.productName });
        if (!isValid.length) {
            throw new Error("Please add main info of product first");
        }
        const isExisted = await productDetailModel.find({ productName: req.body.productName });
        if (isExisted.length) {
            throw new Error("Product name existed");
        }
        const newProductDetail = new productDetailModel({
            productName: req.body.productName,
            detailDescription: req.body.detailDescription,
            detailImgPath: detailImgPath
        })
        await newProductDetail.save();
        res.send(newProductDetail);
        next();
    } catch (error) {
        res.send(error.message);
    }
});
app.put("/admin/upload/modify/main", uploadMain.array('mainFile', 1), async (req, res, next) => {
    console.log(req.body);
    try {
        const files = req.files;

        if (!req.body.productName) {
            throw new Error("Vui lòng nhập đủ các trường thông tin");
        }
        if (!req.body.newProductName) {
            throw new Error("Vui lòng nhập đủ các trường thông tin");
        }
        if (!req.body.newProductType) {
            throw new Error("Vui lòng nhập đủ các trường thông tin");
        }
        if (!req.body.newPrice) {
            throw new Error("Vui lòng nhập đủ các trường thông tin");
        }
        if (!req.body.newInStock) {
            throw new Error("Vui lòng nhập đủ các trường thông tin");
        }
        if (!req.body.newDescription) {
            throw new Error("Vui lòng nhập đủ các trường thông tin");
        }
        if (!await (productModel.find({ productName: req.body.productName })).length) {
            throw new Error("Invalid Product Name");
        };
        if (!files) {
            const docToSave = await productModel.findOneAndUpdate(
                { productName: req.body.productName }
                , {
                    productName: rew.body.newProductName
                    , productType: req.body.newProductType
                    , price: req.body.newPrice
                    , inStock: req.body.newInStock
                    , description: req.body.newDescription
                }, { new: true });
            await docToSave.save();
            res.send(docToSave);
        } else {
            const docToSave = await productModel.findOneAndUpdate(
                { productName: req.body.productName }
                , {
                    productName: rew.body.newProductName
                    , productType: req.body.newProductType
                    , price: req.body.newPrice
                    , inStock: req.body.newInStock
                    , description: req.body.newDescription
                    , mainImgPath: `${__dirname}/storage/main/${files[0].filename}`
                }, { new: true });
            await docToSave.save();
            res.send(docToSave);
        }
    } catch (error) {
        res.send(error.message);
    }
});
app.put("/admin/upload/modify/detail", (req, res, next) => {
    console.log(req.body);
    try {
        res.send('modify detail is in progress');
    } catch (error) {
        res.send(error.message);
    }
});
app.delete("/admin/upload/delete/main", (req, res, next) => {
    console.log(req.body);
    try {
        res.send('edit main is in progress');
    } catch (error) {
        res.send(error.message);
    }
});
app.delete("/admin/upload/delete/detail", (req, res, next) => {
    console.log(req.body);
    try {
        res.send('delete detail is in progress');
    } catch (error) {
        res.send(error.message);
    }
});


app.listen(PORT, () => {
    console.log(`upload_service is listening on PORT ${PORT}`);
})
