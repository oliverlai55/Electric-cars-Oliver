var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/electric';


/* GET home page. */

router.get('/', function (req, res, next) {
	//what is "next"?
	MongoClient.connect(mongoUrl, function (error, db){
		//1. connecting to Mongo Collection
		if (error){
			console.log(error);
			res.redirect('/error', {errorIn: "MongoClient -", error: error});
		} else {
			db.collection('users').find({ip:req.ip}).toArray(function (error, userResult){
				if (error){
					console.log(error);
					res.redirect('/error', {errorIn: "MongoClient -", error: error});
				} else {
					//2 Get the current user from MongoDB via req.ip
					//are we getting the current users ip, and making it into an array?
					var photosVoted = [];
					console.log("============line 17===============");
					console.log(userResult);
					console.log("============line 17===============");
					for (var i=0; i < userResult.length; i++){
						photosVoted.push(userResult[i].image);
							//this is accessing the image of the useResults array
							// this is adding the image property of userResult into the photosVoted array
						};
			       //pushes the users[i] ip into the photosVoted array
			       //Send me EVERYTHING "WHERE" image does not equal anything in this array
			       db.collection('photos').find({image: {$nin: photosVoted} }).toArray(function (error, result){
					//3. Find which photos the current user has NOT voted on
					//4. Load all those photos into an array
					var rand = Math.floor(Math.random() * result.length);
					console.log("============PHOTO Collection===============");
					console.log(result);
					console.log("============PHOTO Collection===============");
					//5. Choose a random image from the array and set it to a var.
					if(result.length == 0){
						res.redirect('/standings');
						//what is awesomeProperty? - 
						// variable that you are giving the ejs file
						//res.render to the standings view and send in the 
						//message "you've voted" that you can display on standings
					}else{
						
						res.render('index', { photo: result[rand] } );
						//6. res.render the index view and send it the photo in 
						//the index.ejs file
					}  
					db.close();
					});
	   			}
	});
		}

		//we put this anywhere where there is a mongo.connect
	});
});



router.get('/standings',function(req, res, next){
	//1. get All the photos


	MongoClient.connect(mongoUrl, function (error, db){
		//1. Get all pictures from the MongoDB
		db.collection('photos').find().toArray(function (error, result){
			//Pass all votes
			if(error){
				console.log(error);
			}
			else{
				result.sort(function (p1, p2){
					return (p2.totalVotes - p1.totalVotes);
						//2. sort them by highest likes
						//please explain
						// what is p1 and p2?
					});


				res.render('standings',{photosStandings: result} );
			}
		db.close();
		//3. res.render the standings view and pass it the sorted photo array
		//where is photosStandings? Is it an object with property: result?
		});
	});
	
});

router.post('*', function (req,res,next){
	if(req.url == '/electric'){
		var page = 'electric';
	}else if (req.url == '/poser'){
		var page = 'poser';
	}else{
		res.redirect('/');
	}
	//this will run for all posted pages
	MongoClient.connect(mongoUrl, function (error, db){
		if (error){
				console.log(error);
				res.redirect('/error', {errorIn: "MongoClient -", error: error});
		} else {
			db.collection('photos').find({image: req.body.photo}).toArray(function (error, result){
				//this will go to "photos" to find all image
				if (error){
					console.log(error);
					res.redirect('/error', {error: error});
				} else {
					var updateVotes = function(db, votes, callback) {
					if(page=='electric'){var newVotes = votes+1;}
					else{var newVotes = votes-1;}
					//where is votes delcared?
					//how are you passing in votes as argument?

					db.collection('photos').updateOne(
						{ "image" : req.body.photo},
						{
							$set: { "totalVotes": newVotes },
						//replaces the value of a field with a specified value
							$currentDate: { "lastModified": true}
							// sets the value of the field to the current Date.
						}, function(err, results) {
							console.log(results);
							callback();
						});
					};

					MongoClient.connect(mongoUrl, function (error, db){
						updateVotes(db,result[0].totalVotes, function() {});
					});
				}
				
			});
		}
	});

	MongoClient.connect(mongoUrl, function (error, db){
//connecting to Mongo going to 'users' collection
		db.collection('users').insertOne( {
			ip: req.ip,
			vote: page,
			image: req.body.photo
			//.body object from req
			//it parses the req
			//image can be any variable
		});
		res.redirect('/');
	});
});

module.exports = router;
