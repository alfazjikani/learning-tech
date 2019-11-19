var mongoose = require('mongoose');

var Counter = require('./counter');

var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    student_id: {type: Number, unique: true},
    first_name: {type: String, required: true, maxlength: 100, match: /^\w+$/},
    family_name: {type: String, required: true, maxlength: 100, match: /^\w+$/},
    date_of_birth: {type: Date, required: true},
    address: {type: String}
});

StudentSchema.virtual('formatted_student_id')
.get(function() {
    console.log('inside virtual');
    return 'NPS';
});

StudentSchema.pre('save', function(next){
    var document = this;

    Counter.findByIdAndUpdate({_id: 'student_id'}, {$inc: { seq: 1} }, 
    {upsert: true, setDefaultsOnInsert: true}, function(error, result) {
        var seq = 0;
        if(error) {
            throw error;
        } else if(result) {
            seq = result.seq;
        }
        document.student_id = seq + 1;
        next();
    });
});

module.exports = mongoose.model('Student', StudentSchema);