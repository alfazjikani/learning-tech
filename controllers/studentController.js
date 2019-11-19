const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');

var Student = require('../models/student');
var Counter = require('../models/counter');

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
        var errors = validationResult(req);
        var errorsArray = errors.array();
        var errorsArrayLen = errorsArray.length;
        var errorMessages = {};
        for(var index=0;index<errorsArrayLen;index++) {
            errorMessages[errorsArray[index].param] = errorsArray[index].msg;
        }

        if(!errors.isEmpty()) {
            res.render('student_form', {
                title: 'Add Student', 
                errorMessages: errorMessages, 
                student: req.body
            });
        } else {
            var documentId = req.body._id;
            delete req.body._id;
            if(!documentId) {
                var student = new Student(req.body);
                student.save(function(error, result) {
                    if(error) {
                        throw error;
                    }

                    res.redirect('/student/list');
                });
            } else {
                Student.findByIdAndUpdate({_id:  mongoose.Types.ObjectId(documentId)}, req.body,
                function(error, result) {
                    if(error) {
                        throw error;
                    }

                    res.redirect('/student/list');
                });
            }
        }
    }
];

exports.getStudentList = function(req, res, next) {
    Student.find({
        is_archieved: {$ne: true}
    })
    .exec(function(error, list_student) {
        if(error) {
            throw error;
        }

        res.render('student_list', {title: 'Student List', student_list: list_student});
    });
};

exports.editStudent = function(req, res, next) {
    var selectedStudentId = parseInt(req.params.id);
    Student.findOne({student_id: selectedStudentId})
    .exec(function(error, student_detail) {
        if(error) {
            throw error;
        }

        res.render('student_form', {
            title: 'Edit Student', 
            student: student_detail
        });
    });
};

exports.deleteStudent = function(req, res, next) {
    var selectedStudentId = parseInt(req.params.id);
    Student.findOneAndUpdate({student_id: selectedStudentId}, {is_archieved: true}, function(error, result) {
        if(error) {
            throw error;
        }

        res.redirect('/student/list');
    });
};