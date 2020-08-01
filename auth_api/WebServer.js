const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();
const registerRoute = require('./handlers/register').registerRoute;
const signInRoute=require('./handlers/sign_in').signInRoute;
app.use(bodyParser.urlencoded({ extended: true }));
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
// application/x-www-form-urlencoded
app.post("/admin/register", function (req, res, next) {
    res.send(req.body);
    // registerRoute(req, res, next);
});
// application/x-www-form-urlencoded
app.post("/admin/sign-in",function(req,res,next){
    res.send(req.body)
    // signInRoute(req,res,next);
})
app.listen(process.env.PORT, () => {
    console.log(`Auth_Service is listening on port ${PORT}`);
}
)