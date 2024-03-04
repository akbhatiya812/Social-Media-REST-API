const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {validationResult} = require('express-validator');
const secretkey = process.env.SECRET_KEY;

exports.signUp = async (req,res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('Validation failed!');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const username = req.body.username;
        
        if(password !== confirmPassword ){
            const error = new Error("Password does not match");
            error.statusCode = 406;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password,12);

        const user = new User({
            email : email,
            password : hashedPassword,
            username: username
        });

        const newUser = await user.save();
        res.status(201).json({message: 'User created!', userId : newUser._id})

    }catch(err){
        err.statusCode = 500;
        next(err);
    }
} 

exports.signIn = async (req,res,next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email: email});

        if(!user){
            const error = new Error("Email doesn't exists!");
            error.statusCode = 402;
            throw error;
        }

        const result = await bcrypt.compare(password,user.password);
        if(result === false){
            const error = new Error("Incorrect Password!");
            error.statusCode = 402;
            throw error;
        }

        const token = jwt.sign(
            {email:user.email,userId: user._id.toString()}, 
            secretkey,
            {expiresIn: '24h'}
        )
        
        res.status(200).json({token: token, userId: user._id.toString()});

    }catch(err){
        err.statusCode =500;
        next(err);
    }
}
