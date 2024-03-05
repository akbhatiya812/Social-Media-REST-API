const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const multer = require('multer');

const dotenv = require('dotenv');
dotenv.config();

const db = require('./configs/mongoose');

const {fileStorage, fileFilter} = require('./configs/multer');


//middlewares
app.use(bodyParser.json());

app.use(multer({storage : fileStorage, fileFilter : fileFilter }).single('image'));
app.use('/images', express.static('images'));



//Router
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/', require('./routes/index'));

app.use((error,req,res,next) => {
    // console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data:data});
})

app.listen(8080);