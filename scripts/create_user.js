var User = require('../models/user');

// initializing database connection
var mongoose = require('mongoose');
var mongoDBCloudUrl = 'mongodb+srv://root:root@cluster0-fcizl.mongodb.net/student_management?retryWrites=true&w=majority';
var mongoDBOnpremiseUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management';
var mongoDBUrl = process.env.MONGODB_URI || mongoDBCloudUrl || mongoDBOnpremiseUrl;
mongoose.connect(mongoDBUrl, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection failed!!'));

var user = new User({
    user_id: 'admin',
    password: 'admin'
});

user.save(function(error) {
    if(error) {
        next(new Error('Something went wrong!'));
    }

    console.log('user saved successfully!');
});

