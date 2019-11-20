var User = require('../models/user');

// initializing database connection
var mongoose = require('mongoose');
var mongoDBUrl = 'mongodb://localhost:27017/student_management';
mongoose.connect(mongoDBUrl, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection failed!!'));

var user = new User({
    user_id: 'admin',
    password: 'admin'
});

user.save(function(error) {
    if(error) {
        throw error;
    }

    console.log('user saved successfully!');
});

