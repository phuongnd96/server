const express = require('express');
const app = express();
// passing PORT as argv from commandline
const PORT =process.argv[2]||process.env.PORT;
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();
const registerRoute = require('./handlers/register').registerRoute;
const signInRoute = require('./handlers/sign_in').signInRoute;
const changePasswordRoute =require('./handlers/change_password').changePasswordRoute;
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
app.post("/admin/register", (req, res, next) => {
    registerRoute(req, res, next);
});
// application/x-www-form-urlencoded
app.post("/admin/sign-in", (req, res, next) => {
    signInRoute(req, res, next);
});
// application/x-www-form-urlencoded
app.put("/admin/change-password", (req, res, next) => {
    changePasswordRoute(req,res,next);
})
app.listen(process.env.PORT, () => {
    console.log(`Auth_Service is listening on port ${PORT}`);
}
)