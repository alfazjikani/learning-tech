var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_id: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

UserSchema.pre('save', function(next) {
    var doc = this;
    bcrypt.hash(doc.password, 10, function(error, hash) {
        if(error) {
            next(new Error('Something went wrong!'));
        }

        doc.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema);