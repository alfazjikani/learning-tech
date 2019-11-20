const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var bcrypt = require('bcryptjs');

var User = require('../models/user');

exports.getLoginForm = function(req, res, next) {
    res.render('login_form');
};

exports.login = [
    // validate detail
    body('user_id').trim().isLength({min: 1}).withMessage('User ID is required.'),
    body('password').trim().isLength({min: 1}).withMessage('Password is required.'),

    function(req, res, next) {
        var errors = validationResult(req);
        var errorsArray = errors.array();
        var errorsArrayLen = errorsArray.length;
        var errorMessages = {};
        for(var index=0;index<errorsArrayLen;index++) {
            errorMessages[errorsArray[index].param] = errorsArray[index].msg;
        }

        if(!errors.isEmpty()) {
            res.render('login_form', {
                errorMessages: errorMessages, 
                user: req.body
            });
        } else {
            var loginFailMessage = 'User ID or Password is incorrect.';
            
            User.findOne({user_id: req.body.user_id})
            .exec(function(error, user) {
                if(error) {
                    throw error;
                }

                if(!user) {
                    res.render('login_form', {
                        errorMessages: {message: loginFailMessage}, 
                        user: req.body
                    });
                } else {
                    bcrypt.compare(req.body.password, user.password, function(error, result) {
                        // login successfull
                        if(result) {
                            req.session.user_id = user._id;
                            res.redirect('/');
                        } else {
                            res.render('login_form', {
                                errorMessages: {message: loginFailMessage}, 
                                user: req.body
                            });
                        }
                    });
                }
            });
        }
    }
];

exports.validateRequest = function(req, res, next) {
    if(req.session && req.session.user_id) {
        next();
    } else {
        res.redirect('/login');
    }
};

exports.logout = function(req, res, next) {
    if(req.session && req.session.user_id) {
        req.session.destroy(function(error) {
            if(error) {
                throw error;
            }
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
};