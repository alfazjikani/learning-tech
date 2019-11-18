const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.getStudentForm = function(req, res, next) {
    res.render('student_form', {title: 'Add Student'});
};

exports.saveStudentForm = [
    
    // validate detail
    body('first_name').trim().isLength({min: 1}).withMessage('First Name is required.'),
    body('first_name').trim().isAlphanumeric().optional({checkFalsy: true}).withMessage('Please enter valid First Name.'),
    body('family_name').trim().isLength({min: 1}).withMessage('Last Name is required.'),
    body('family_name').trim().isAlphanumeric().optional({checkFalsy: true}).withMessage('Please enter valid Last Name.'),
    body('date_of_birth').trim().isLength({min: 1}).withMessage('Date of Birth is required.'),
    body('date_of_birth').isISO8601().optional({checkFalsy: true}).withMessage('Please enter valid Date of Birth.'),

    // sanitize detail
    sanitizeBody('first_name').escape(),
    sanitizeBody('last_name').escape(),
    //sanitizeBody('date_of_birth').toDate(),

    function(req, res, next) {
        var student = req.body;
        
        var errors = validationResult(req).array();
        var errorMessages = {};
        for(var index=0;index<errors.length;index++) {
            errorMessages[errors[index].param] = errors[index].msg;
        }

        console.log(errors);
        console.log(req.body);

        //res.send(errors);
        res.render('student_form', {
            title: 'Add Student', 
            errorMessages: errorMessages, 
            student: student
        });
    }
];