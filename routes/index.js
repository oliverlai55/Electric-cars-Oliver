var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/NBAPlayers';


/* GET home page. */

router.get('/'), function (req, res, next) {
	MongoClient.connect(mongoUrl, function (error, db){
		db.collection('users').find({ip:req.ip}).toArray(function (error, result){

			var userVotedOnPhotos = [];
			var returnedPhotos = [];
			for (var i=0; i<results.length; i++){
				userVotedOnPhotos.push(result[i].photo);
			};

			db.collection('NBAPlayers').find({photo: {$nin: userVotedOnPhotos} }).toArray(function (err, playerResult){
				returnedPhotos = playerResult;

				if(returnedPhotos.length == 0){
					res.render('index');
				}else{
					var rand = Math.floor(Math.random()*returnedPhotos.length);
					res.render('index', { players: returnedPhotos[rand] } );
				}  
			});
		});
	});
};


// router.get('/', function(req, res, next) {
//     MongoClient.connect(mongoUrl, function (error, db){
//         db.collection('NBAPlayers').find().toArray(function (error, result){
//             console.log(result);
//             console.log("==");
//             pictureArray = [];

//             var rand1 = Math.floor(Math.random()*result.length);
//   			res.render('index', { player: result[rand] });

//   			console.log(result[rand]);
//         });
//     });

// 	//index page should load random picture/item
// 	//1. Get all pictures from the MongoDB
// 	//2 Get the current user from MongoDB via req.ip
// 	//3. Find which pphotos the currect user has NOT voted on
// 	//4. Load all those photos into an array
// 	//5. Choose a random iage from the array and set it to a var.
// 	//6. res.render the index view and send it the photo

// 	// var serverphoto = [
//  //        {name: 'http://chadconway.pbworks.com/f/1253765817/news-electriccar1.jpg' },
//  //        {name: 'https://c2.staticflickr.com/2/1307/4700132636_cd67861c4b_b.jpg' }
//  //     ];
 	
// });

router.get('/standings',function(req, res, next){
	//1. get All the photos
	//2. sort them by highest likes
	//3. res.render the standings view and pass it the sorted photo array
	res.render('index', { title: 'Standings' });
});

// router.post('/team'), function(req, res, next){
// 	MongoClient.connect('mongodb://localhost:27017/NBAPlayers', function(error, db){
// 		db.collection('')
// 	})
// }


router.post('*', function(req,res,next){
	//this will run for all posted pages
});
module.exports = router;
