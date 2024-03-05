const mongoose = require('mongoose');
const url = process.env.MONGO_URL;

mongoose.connect(url).catch(err=> {
    console.log(err);
});