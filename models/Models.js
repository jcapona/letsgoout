var config = require('../config');

// Mongo DB connection
var mongoose = require('mongoose');
var dbURI = "mongodb://"+config[config.environment].database.credentials+"@"+config[config.environment].database.host+":"+config[config.environment].database.port+"/"+config[config.environment].database.name;
mongoose.connect(dbURI);

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, index: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    avatar: {type: String, default: "http://www.qatarliving.com/sites/all/themes/qatarliving_v3/images/avatar.jpeg"},
    created: { type: Date, default: Date.now },
});
var User = mongoose.model('users', UserSchema);

module.exports = {
    UserModel: User
};
