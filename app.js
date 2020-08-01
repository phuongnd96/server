const PORT = process.env.PORT || 3000;
const ClientProductModels = require('./models/ClientProductModel').ClientProductModels;
const AdminModels = require('./models/AdminModel').AdminModels;
const BillModels = require('./models/BillModel').BillModels;
const DescriptionModels = require('./models/DescriptionModel').DescriptionModel;
const MainModels = require('./models/MainModel').MainModel;
const SlidePicModels = require('./models/SlidePicsModel').SlideModel;
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const requestIp = require('request-ip');
//lấy dữ liệu từ file .env gắn vào object process.env
// Ví dụ: process.env.PORT=3000;
const dotenv = require('dotenv').config();
const AdminRoutes = express.Router();
const clientRoutes = express.Router();
var bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.bodyParser());
// app.use(function (req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.setHeader("X-Frame-Options", "ALLOWALL");
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "POST, GET, PUT, DELETE, OPTIONS"
//     );
//     next();
// });
// Set storage, lưu ở thưc mục upload (`${__dirname}/upload`)
const storageMainImageFiles = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/mainFiles')
    },
    filename: function (req, file, cb) {
        cb(null, `mainFile${Date.now()}` + path.extname(file.originalname))
    }
});
const storageSlideFiles = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/slideFiles')
    },
    filename: function (req, file, cb) {
        cb(null, `slideFile${Date.now()}` + path.extname(file.originalname))
    }
});
const storageDescriptionFiles = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/descriptionFiles')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
// upload file
const uploadMain = multer({ storage: storageMainImageFiles });
const uploadSlide = multer({ storage: storageSlideFiles });
const uploadDescription = multer({ storage: storageDescriptionFiles });
// Allow cross-origin request
app.use(requestIp.mw());
app.use("/", function (req, res, next) {
    const ip = req.clientIp;
    console.log(`${new Date().toISOString()} IP: ${ip} `);
    console.log(req.header);
    next();
});
// Specific Routes
// Routes for admin post contents, etc...
app.use("/admin/posts", AdminRoutes);
// Client routes
app.use("/client", clientRoutes);
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// set Secret key
app.set('SecretKey', process.env.SECRET_KEY);
//Connect to database
try {
    mongoose.connect(process.env.MONGO_URL,
        { useNewUrlParser: true }, (err) => {
            if (err) throw err;
            logger.info('Success');
        })
} catch (error) {
    logger.error(error.message)
};
// Routers
app.post("/cart", async (req, res, next) => {
    try {
        const docToSave = new BillModels({
            billId: req.body.billId,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            isPaid: req.body.isPaid,
            purchaseDate: new Date(),
            paidDate: null,
            products: req.body.products
        })
        const saved = await docToSave.save();
        res.status(201).json({
            errorCode: 201,
            saved: saved
        });
        next();
    } catch (error) {
        res.send(error.message);
        next(error);
    }
});
app.post("/admin/register", async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = new AdminModels({
        username: username,
        password: password
    });
    if (await AdminModels.exists({ username: username }) === false) {
        try {
            await bcrypt.hash(password, 10, function (err, hash) {
                // Store hashed password to DB.
                if (err) throw err;
                user.username = username;
                user.password = hash;
                user.save((err, result) => {
                    if (err) throw err;
                    res.status(201).json({
                        errorCode: 201,
                        message: "Registration Success",
                        username: username,
                        timeStamp: `${new Date().toISOString()}`
                    });
                });
            });
        } catch (error) {
            logger.error(error);
        }
    } else {
        res.status(406).json({
            errorCode: "406",
            message: "existed user"
        });
    }
});
app.post("/admin/sign-in", async (req, res, next) => {
    try {
        await AdminModels.findOne({
            username: req.body.username
        }, async (err, result) => {
            if (err) throw err;
            await bcrypt.compare(req.body.password, result.password, function (err, result) {
                const payload = {
                    check: true
                };
                const token = jwt.sign(payload, app.get('SecretKey'), {
                    expiresIn: 7776000
                })
                if (result) {
                    // Passwords match
                    res.status(200).json({
                        "errorCode": 200,
                        "message": "authentication sucesss",
                        "token": token
                    })
                } else {
                    // Passwords don't match
                    res.status(400).json({
                        "errorCode": 400,
                        "message": "false"
                    })
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
});
app.get("/name", async (req, res, next) => {
    const searchText = new RegExp(`^${req.query.productname}`);
    try {
        await ClientProductModels.find({
            productName: searchText
        }, (err, searchResult) => {
            if (err) throw err;
            else {
                res.json({
                    errorCode: 200,
                    message: "Success",
                    products: searchResult
                })
            }
        })
    } catch (error) {
        res.status(404).json({
            errorCode: 404,
            message: "Not found"
        })
    }

})
// tìm các sản phẩm theo loại sản phẩm và sắp xếp theo khoảng giá dựa vào biến isAscending
app.get("/filter", async (req, res, next) => {
    await ClientProductModels.find({
        productType: req.query.productType
    }, (err, filteredByType) => {
        // filterdByType is an array
        let sortedInRange = filteredByType.filter((product) => {
            return product.price >= req.query.min && product.price <= req.query.max
        });
        if (req.query.isAscending) {
            sortedInRange.sort((productA, productB) => {
                return productA.productName.toLowerCase() - productB.productName.toLowerCase()
            });
        } else {
            sortedInRange.sort((productA, productB) => {
                return productB.productName.toLowerCase() - productA.productName.toLowerCase()
            });
        }
        res.status(200).json({
            errorCode: 200,
            message: "Success",
            sortedResult: sortedInRange
        })
    })
})
app.get("/getAllInfo", (req, res, next) => {
    try {
        if (!req.query.page) {
            ClientProductModels.find((err, queryResult) => {
                if (err) { console.log(error) }
                else {
                    res.status(200).json({
                        errorCode: 200,
                        products: queryResult
                    })
                }
            })
        }
        ClientProductModels.find().sort({ 'productName': -1 }).exec((err, queryResult) => {
            if (err) throw err;
            else {
                let perPage = 10;
                let begin = (req.query.page - 1) * perPage;
                let end = (req.query.page - 1) * perPage + perPage;
                let products = queryResult.slice(begin, end);
                res.status(200).json({
                    errorCode: 200,
                    products: products
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            errrorCode: 404,
            message: "not found"
        })
    }
})
app.get("/getDescImgByPath", async (req, res, next) => {
    try {
        const queryResult = await DescriptionModels.find({ id: req.query.id });
        if (queryResult.length != 1) {
            throw new Error("Invalid path. Path must be unique.")
        }
        if (queryResult[0].content === req.query.content) {
            res.sendFile(`${queryResult[0].descriptionImagePath}`);
        }
        res.sendFile(`${queryResult[0].descriptionImagePath}`);
    } catch (error) {
        res.send(error.message)
    }
});
app.get("/getMainImgByPath", async (req, res, next) => {
    try {
        console.log(req.query.id);
        const queryResult = await MainModels.find({ id: req.query.id });
        if (queryResult.length != 1) {
            throw new Error("Invalid path. Path must be unique.")
        }
        if (queryResult[0].color === req.query.color) {
            res.sendFile(`${queryResult[0].mainImagePath}`);
        }
    } catch (error) {
        res.send(error.message);
    }
});
app.get("/getSlideImgByPath", async (req, res, next) => {
    try {
        const queryResult = await SlidePicModels.find({ id: req.query.id });
        if (queryResult.length != 1) {
            throw new Error("Invalid path. Path must be unique.")
        }
            res.sendFile(`${queryResult[0].slidePicsImagePath}`);
    } catch (error) {
        res.send(error.message);
    }
})
// set globals variable to pass between routes
let result = {}
app.get("/getAll", async (req, res, next) => {
    try {
        await ClientProductModels.find((err, data) => {
            if (err) throw err;
            else {
                result.ClientProductInfo = data;
            }
        })
        await DescriptionModels.find((err, data) => {
            if (err) throw err;
            else {
                result.Description = data;
            }
        })
        await MainModels.find((err, data) => {
            if (err) throw err;
            else {
                result.Main = data;
            }
        })
        next();
    } catch (error) {
        res.status(404).send("not found")
    }
});
app.get("/getAll", async (req, res, next) => {
    try {
        await SlidePicModels.find((err, data) => {
            if (err) throw err;
            else {
                result.Slide = data;
            }
        });
        res.status(200).json({
            errorCode: 200,
            result: result
        })
    } catch (error) {
        res.status(404).send("not found")
    }
})
app.get("/getProductInfoById", (req, res, next) => {
    // res.send(req.body.id);
    try {
        ClientProductModels.find({ id: req.body.id }, (err, searchResult) => {
            if (err) throw err;
            else {
                console.log(searchResult);
                res.status(200).json({
                    errorCode: 200,
                    product: searchResult
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            errorCode: 404,
            message: "Not Found"
        })
    }
});
app.get("/getDescriptionById", (req, res, next) => {
    try {
        DescriptionModels.find({ id: req.body.id }, (err, searchResult) => {
            if (err) throw err;
            else {
                console.log(searchResult);
                res.status(200).json({
                    errorCode: 200,
                    description: searchResult
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            errorCode: 404,
            message: "Not Found"
        })
    }
});
// Routes for admin to post products
// Get List Products
app.get("/getAllPaginated", (req, res, next) => {
    try {
        // res.send(req.query.page);
        ClientProductModels.find().sort({ 'productName': -1 }).exec((err, queryResult) => {
            if (err) throw err;
            else {
                let perPage = 10;
                let begin = (req.query.page - 1) * perPage;
                let end = (req.query.page - 1) * perPage + perPage;
                let products = queryResult.slice(begin, end);
                res.status(200).json({
                    errorCode: 200,
                    products: products
                })
            }
        })
    } catch (error) {
        logger.error(error)
        // console.log(error)
        res.status(404).json({
            errrorCode: 404,
            message: "not found"
        })
    }
})
// Web token
AdminRoutes.use((req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        jwt.verify(token, app.get('SecretKey'), (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).json(
                    {
                        errorCode: 401,
                        message: "unauthorized.Invalid token."
                    }
                );
            } else {
                console.log(`Auth sucess. ${new Date().toISOString()}`)
                req.decoded = decoded;
                next();
            }
        })
    } else {
        res.status(401).json({
            errorCode: 401,
            message: "unauthorized. Mising token."
        })
    }
})
// Các routes ở dưới là sẽ là route con của route Admin ở trên.
// Ví dụ "/postContent" sẽ có URL đầy đủ là locahost:PORT/admin/posts/postContent
AdminRoutes.post("/uploadDescription", uploadDescription.array('descriptionFiles', 5), async (req, res, next) => {
    const files = req.files;
    if (!files) {
        res.status(400).json({
            errorCode: 400,
            message: "File not found"
        })
    } else {
        try {
            const isExisted = await DescriptionModels.find({ id: req.body.id });
            if (isExisted.length != 0) {
                throw new Error("Invalid ID")
            }
            if (files.length < 2) {
                const data = new DescriptionModels({
                    id: req.body.id,
                    content: req.body.content,
                    descriptionImagePath: `${__dirname}/upload/descriptionFiles/${files[0].filename}`,
                });
                await data.save((err, result) => {
                    if (err) {
                        throw err
                    } else {
                        res.status(201).json({
                            errorCode: 201,
                            saved: result
                        })
                    }
                })
            }
            else {
                throw new Error("Invalid file length");
            }
        } catch (error) {
            res.send(error);
        }
    }
})
AdminRoutes.post("/uploadMain", uploadMain.array('mainFiles', 5), async (req, res, next) => {
    const isExisted = await MainModels.find({ id: req.body.id });
    if (isExisted.length != 0) {
        throw new Error("Invalid ID")
    }
    const files = req.files;
    if (!files) {
        res.status(400).json({
            errorCode: 400,
            message: "File not found"
        })
    } else {
        try {
            if (files.length < 2) {
                const data = new MainModels({
                    id: req.body.id,
                    color: req.body.color,
                    mainImagePath: `${__dirname}/upload/mainFiles/${files[0].filename}`
                });
                console.log(data);
                await data.save((err, result) => {
                    if (err) throw err;
                    else {
                        res.status(201).json({
                            errorCode: 201,
                            saved: result
                        })
                    }
                })
            } else {
                res.send('Invalid file length');
            }
        } catch (error) {
            // console.log(error);
            res.send(error.message);
        }
    }
})
AdminRoutes.post("/uploadSlidePics", uploadSlide.array('slideFiles', 5), async (req, res, next) => {
    const isExisted = await SlidePicModels.find({ id: req.body.id });
    if (isExisted.length != 0) {
        throw new Error("Invalid ID")
    }
    try {
        const files = req.files;
        if (!files) {
            throw new Error("File is required")
        } else {
            const data = new SlidePicModels({
                id: req.body.id,
                slidePicsImagePath: `${__dirname}/upload/slideFiles/${files[0].filename}`
            });
            await data.save();
            res.status(201).json({
                errorCode: 201,
                saved: data
            })
        }
    } catch (error) {
        // console.log(error)
        res.send({
            "error": error.message
        })
    }

})
// Lẽ ra là adminroute nhưng do bị lỗi bí hiểm nên dùng app không yêu cầu token
app.post("/uploadProductInfo", async (req, res, next) => {
    try {
        const isExisted = await ClientProductModels.find({ id: req.body.id });
        if (isExisted.length != 0) {
            throw new Error("Invalid ID")
        }
        const data = new ClientProductModels({
            id: req.body.id,
            productName: req.body.productName,
            productType: req.body.productType,
            price: req.body.price
        });
        await data.save((err, result) => {
            if (err) throw err;
            else {
                res.status(201).json({
                    errorCode: 201,
                    saved: result
                })
            }
        })
    } catch (error) {
        res.send(error.message);
    }

})
app.put("/updateDescription", uploadDescription.array('descriptionFiles', 5), async (req, res, next) => {
    // nếu trùng content và tồn tại id -> đổi path mới
    try {
        const files = req.files;
        if (!files) {
            res.status(400).json({
                errorCode: 400,
                message: "File not found"
            })
        } else {
            const queryResult = await MainModels.find({ id: req.body.id });
            if (!queryResult.length || queryResult.length != 1) {
                throw new Error("Invalid id");
            }
            if (files.length > 1) {
                throw new Error("Invalid file number");
            }
            if (req.body.content == queryResult.content) {
                const updatedDoc = await DescriptionModels.findOneAndUpdate(
                    { id: req.body.id },
                    { descriptionImagePath: `${__dirname}/upload/descriptionFiles/${files[0].filename}` }
                    , { new: true });
                res.status(200).json({
                    modified: updatedDoc
                })
            }
        }
    } catch (error) {
        res.json({
            "error": error.message
        });
    }

});
// updateMain
app.put("/updateMain", uploadMain.array('mainFiles', 5), async (req, res, next) => {
    // nếu trùng màu ảnh và tồn tại id -> đổi path mới
    // res.send(req.body.id)
    // modify here
    try {
        const files = req.files;
        if (!files) {
            throw new Error("No file was chosen");
        }
        if (!req.body.id || req.body.id == "") {
            throw new Error("Id is required");
        }
        if (!req.body.color || req.body.color == "") {
            throw new Error("color is required");
        }
        const queryResult = await MainModels.find({ id: req.body.id });
        if (!queryResult || queryResult.length == "") {
            throw new Error("Invalid id");
        }
        const updatedDoc = await MainModels.findOneAndUpdate({ id: req.body.id }, { color: req.body.color, mainImagePath: `${__dirname}/upload/mainFiles/${files[0].filename}` }, { new: true });
        res.json({
            modified: updatedDoc
        })
    } catch (error) {
        res.json({
            "error": error.message
        });
    }
});
app.put("/updateProductInfo", async (req, res, next) => {
    // nếu trùng id thì update productName,productType
    try {
        if (!req.body.id || req.body.id == "") {
            throw new Error("id is required");
        };
        if (!req.body.productName || req.body.productName == "") {
            throw new Error("productName is required");
        };
        if (!req.body.productType || req.body.productType == "") {
            throw new Error("producType is required");
        }
        if (!req.body.price || req.body.price == "") {
            throw new Error("price is required");
        }
        const queryById = await ClientProductModels.find({ id: req.body.id });
        if (queryById.length != 1) {
            throw new Error("invalid product id");
        };
        const updatedDoc = await ClientProductModels.findOneAndUpdate({ id: req.body.id }, { productName: req.body.productName, productType: req.body.productType, price: req.body.price }, { new: true });
        res.status(200).json({
            modified: updatedDoc
        })
    } catch (error) {
        res.json({
            "error": error.message
        });
    }
});
app.put("/updateSlidePic", uploadSlide.array('slideFiles', 5), async (req, res, next) => {
    try {
        const files = req.files;
        if (!files) {
            throw new Error("File is required");
        }
        if (!req.body.id || req.body.id == "") {
            throw new Error("Id is required");
        }
        const queryById = await SlidePicModels.find({ id: req.body.id });
        if (!queryById || queryById == "") {
            throw new Error("Invalid id");
        }
        const updatedDoc = await SlidePicModels.findOneAndUpdate({ id: req.body.id }, { slidePicsImagePath: `${__dirname}/upload/slideFiles/${files[0].filename}` }, { new: true });
        res.status(200).json({
            modified: updatedDoc
        })
    } catch (error) {
        res.json({
            "error": error.message
        });
    }

});


app.listen(process.env.PORT, () => {
    console.log(`app is listening on port ${PORT}`);
}
)