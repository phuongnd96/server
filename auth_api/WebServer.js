const express=require('express');
const app=express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const dotenv = require('dotenv').config();
const registerRoute=require('./handlers/register').registerRoute;
app.use(cors());
app.post("/admin/register",registerRoute);
app.listen(process.env.PORT, () => {
    console.log(`Auth_Service is listening on port ${PORT}`);
}
)