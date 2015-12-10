// this is the model for photos

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	ip: String
});

module.exports = mongoose.model('users', usersSchema)

