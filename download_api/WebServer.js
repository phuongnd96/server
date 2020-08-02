const express=require('express');
const mongoose=require('mongoose');
const PORT=process.argv[2] || process.env.PORT;
const app =express();
const cors=require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const {downloadMainImageRoute,downloadDetailImageRoute}=require('./handler/download_image_handler');
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
app.get("/assets/main",(req,res,next)=>{
    downloadMainImageRoute(req,res,next);
})
app.get("/assets/detail",(req,res,next)=>{
    downloadDetailImageRoute(req,res,next);
});




app.listen(PORT,()=>{
    console.log(`download service is listening on PORT ${PORT}`);
})