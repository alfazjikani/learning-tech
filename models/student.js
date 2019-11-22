var mongoose = require('mongoose');
var moment = require('moment');

var Counter = require('./counter');

var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    student_id: {type: Number, unique: true},
    first_name: {type: String, required: true, maxlength: 100, match: /^\w+$/},
    family_name: {type: String, required: true, maxlength: 100, match: /^\w+$/},
    date_of_birth: {type: Date, required: true},
    address: {type: String},
    is_archieved: {type: Boolean, required: true, default: false}
});

StudentSchema.virtual('name')
.get(function() {
    return this.first_name + ' ' + this.family_name;
});

StudentSchema.virtual('age')
.get(function() {
    return moment().diff(this.date_of_birth, 'years');
});

StudentSchema.virtual('formatted_student_id')
.get(function() {
    var studentIdLength = this.student_id.toString().length;
    var formatted_student_id = this.student_id;
    for(var index=studentIdLength;index<5;index++) {
        formatted_student_id = '0' + formatted_student_id;
    }
    
    return 'NPS' + formatted_student_id;
});

StudentSchema.pre('save', function(next){
    var document = this;

    Counter.findByIdAndUpdate({_id: 'student_id'}, {$inc: { seq: 1} }, 
    {upsert: true, setDefaultsOnInsert: true}, function(error, result) {
        var seq = 0;
        if(error) {
            next(new Error('Something went wrong!'));
        } else if(result) {
            seq = result.seq;
        }
        document.student_id = seq + 1;
        next();
    });
});

module.exports = mongoose.model('Student', StudentSchema);