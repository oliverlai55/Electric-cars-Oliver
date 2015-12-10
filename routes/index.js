var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/electric';


/* GET home page. */

router.get('/', function (req, res, next) {
	MongoClient.connect(mongoUrl, function (error, db){
		//1. Get all pictures from the MongoDB
		db.collection('users').find({ip:req.ip}).toArray(function (error, userResult){
		//2 Get the current user from MongoDB via req.ip
			var photosVoted = [];
			for (var i=0; i<userResult.length; i++){
				photosVoted.push(userResult[i]);
			};

		db.collection('photos').find({photo: {$nin: photosVoted} }).toArray(function (error, result){
				//3. Find which pphotos the currect user has NOT voted on
			var rand = Math.floor(Math.random() * result.length);
				//4. Load all those photos into an array

				if(result.length == 0){
					res.render('standings', {awesomeProperty: "you've voted"});
				}else{
					
					//5. Choose a random iage from the array and set it to a var.
					res.render('index', { photo: result[rand] } );
					//6. res.render the index view and send it the photo
				}  
			});
		});
	});
});



router.get('/standings',function(req, res, next){
	//1. get All the photos
	//2. sort them by highest likes
	//3. res.render the standings view and pass it the sorted photo array
	MongoClient.connect(mongoUrl, function (error, db){
		//1. Get all pictures from the MongoDB
		db.collection('photos').find().toArray(function (error, result){
			//Pass all votes

			result.sort(function (p1, p2){
				return (p2.totalVotes - p1.totalVotes);
			});

			res.render('standings',{photosStandings: result} );

		});
	});
	
});

router.post('*', function(req,res,next){
	if(req.url == '/electric'){
		var page = 'electric';
	}else if (req.url == '/poser'){
		var page = 'poser';
	}else{
		res.redirect('/');
	}
	//this will run for all posted pages
	MongoClient.connect(mongoUrl, function (error, db){
		db.collection('photos').find({image: req.body.photo}).toArray(function (error, result){
			var updateVotes = function(db, votes, callback) {
				if(page=='electric'){var newVotes = votes+1;}
				else{var newVotes = votes-1;}

				db.collection('photos').updateOne(
					{ "image" : req.body.photo},
					{
						$set: { "totalVotes": newVotes },
						$currentDate: { "lastModified": true}
					}, function(err, results) {
						console.log(results);
						callback();
					});
			};

			MongoClient.connect(mongoUrl, function (error, db){
				updateVotes(db,result[0].totalVotes, function() {});
			});
		});
	});

	MongoClient.connect(mongoUrl, function (error, db){

		db.collection('users').insertOne( {
			ip: req.ip,
			vote: page,
			image: req.body.photo
		});
		res.redirect('/');
	});
});

module.exports = router;
