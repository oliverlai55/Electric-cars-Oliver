// this is the model for photos

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
	image: String, 
	totalVotes: Number
});

module.exports = mongoose.model('photos', photoSchema)

