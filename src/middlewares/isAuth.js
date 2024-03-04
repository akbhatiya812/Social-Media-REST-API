const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;

module.exports = (req,res,next) => {
    const authHeader = req.get('authorization');

    if(!authHeader){
        const error = new Error("Not Authenticated!");
        error.statusCode = 401;
        throw error;
    } 

    const token = authHeader.split(' ')[1];
    try{
        let decodeToken = jwt.verify(token, secretkey);
        if(!decodeToken){
            const error = new Error('Not Authenticated!');
            error.statusCode = 401;
            throw error;
        }

        req.userId = decodeToken.userId;
        next();
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

}