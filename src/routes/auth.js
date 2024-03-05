const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const User = require('../model/User');

router.post('/sign-up', [
    body('email').isEmail().withMessage('Please Enter a valid Email!').custom( async (value,{req}) => {
        try{
            const user = await User.findOne({email:value});
            if(user){
                const error = new Error('Email already exists');
                error.statusCode = 422;
                throw error;
            }
            return true;
        }catch(err){
            err.statusCode = 500;
            throw err;
        }
    }).normalizeEmail(),
    body('password').trim().isLength({min:5}),
    body('username').trim().not().isEmpty()
], authController.signUp);

router.post('/sign-in', authController.signIn);

module.exports = router;