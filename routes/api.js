var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var db;
var mongoose = require('mongoose');

var Photo = require('../models/photos')
var Users = require('../models/users')

var mongoUrl = 'mongodb://localhost:27017/electric';
mongoose.connect(mongoUrl);
/* GET home page. */

router.get('/photos/get', function (req, res, next) {
	Photo.find(function(err,photosResult){
		//what is Photo? the name of index.ejs?

		if(err){
			console.log(err);
		}else{
			res.json(photosResult);
			//this gets all the info from my collection
			console.log('test');
			//going to kick back result, kicks back json
		}
	})
});


router.post('/photos/post', function (req,res, next){
	var photo = new Photo();
	photo.name = req.body.name;
	photo.image = req.body.image;
	photo.totalVotes = 0;

	photo.save(function(err){
		if(err){
			console.log(err);
		}else{
			res.json({message: 'Photo added!'});
		}
	})
});


router.put('/photos/update', function (req, res, next){
	Photo.find({name: req.params.name}, function (err, photosResult){
		//same as mongo: db.collection('photos').find({image: req.body.photo}).toArray
		console.log(photosResult);
		console.log("================");
	console.log(req.params.name);
		console.log("================");
		console.log(req.params.photo);
	 if(err){
	 	console.log(err);
	 }else{
	 	photosResult.image = req.params.photo; //change the property of the object
	 	//we got from Mongo
	 	//set the results image to whatever is in params.photo
	 	photoResult.save(function(err){
	 		if(err){
	 			console.log(err);
	 		}else{
	 			res.json({message: "Photo was updated!"})
	 		}
	 	});
	 }
	});

});

router.delete('/photos/delete', function (req, res, next){
	Photo.remove({
		_id: req.params.photo_id
	}, function(err, photo){
		if(err){
			console.log(err);
		}else{
			res.json({message: "Successfully deleted!"});
		}
	})
});

router.get('/users/get', function (req, res, next) {
	Users.find(function(err,usersResult){
		if (err){
			console.log(err);
		}else{
			res.json(usersResult);
		}
	})
});

module.exports = router;
