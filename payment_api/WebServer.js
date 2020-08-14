const express = require('express');
const mongoose = require('mongoose');
const PORT = process.argv[2] || PORT;
const app = express();
const cors = require('cors');
const pid = process.pid;
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const { paymentRoute } = require('./handler/payment_route');
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
app.post("/payment", (req, res, next) => {
    paymentRoute(req, res, next);
})
app.listen(PORT, () => {
    console.log(`product service is listening on PORT ${PORT}`);
})