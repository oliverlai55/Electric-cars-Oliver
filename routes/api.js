var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/NBAPlayers';
var db;
var mongoose = require('mongoose');
mongoose.connect(mongoUrl);


/* GET home page. */

router.get('/', function (req, res, next) {
	MongoClient.connect(mongoUrl, function (error, db){
		//1. Get all pictures from the MongoDB
		db.collection('users').find({ip:req.ip}).toArray(function (error, result){
		//2 Get the current user from MongoDB via req.ip
			var photoVoted = [];
			var returnedPhotos = [];
			for (var i=0; i<result.length; i++){
				photoVoted.push(result[i].photo);
			};

		db.collection('NBAPlayers').find({photo: {$nin: photoVoted} }).toArray(function (err, playerResult){
				//3. Find which pphotos the currect user has NOT voted on
				returnedPhotos = playerResult;
				//4. Load all those photos into an array

				if(returnedPhotos.length == 0){
					res.render('standings', {awesomeProperty: "you've voted"});
				}else{
					var rand = Math.floor(Math.random()*returnedPhotos.length);
					//5. Choose a random iage from the array and set it to a var.
					res.render('index', { players: returnedPhotos[rand] } );
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
		db.collection('NBAPlayers').find().toArray(function (error, result){
			//Pass all votes

			result.sort(function (p1, p2){
				return (p2.totalVotes - p1.totalVotes)
			});

			res.render('standings',{photoStandings: result} );

		});
	});
	
});

// router.post('/team'), function(req, res, next){
// 	MongoClient.connect('mongodb://localhost:27017/NBAPlayers', function(error, db){
// 		db.collection('')
// 	})
// }


router.post('*', function(req,res,next){
	if(req.url == '/team'){
		var page = 'team';
	}else if (req.url == '/bench'){
		var page = 'bench';
	}else{
		res.redirect('/');
	}
	//this will run for all posted pages
	MongoClient.connect(mongoUrl, function (error, db){
		db.collection('NBAPlayers').find({image: req.body.photo}).toArray(function (error, result){
			var updateVotes = function (db, votes, callback){
				if(page=='team'){var newVotes = votes + 1;}
				else{var newVotes = votes - 1;}
			}
		})
	})
});
module.exports = router;
