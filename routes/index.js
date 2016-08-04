var express = require('express');
var router = express.Router();

var tweetBank = require('../tweetBank');
var bodyParser = require('body-parser');
var client = require("../db/");

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/', function(req,res){
  client.query('select tweets.id, name, pictureurl, content from tweets join users on tweets.userid=users.id', function(err, result){
    if (err) return next(err);
    var tweets= result.rows;
    console.log(tweets)
    res.render('index',{title: 'Twitter.js', tweets: tweets, showForm: true, pictureurl: result.pictureurl}); 
  });
});

router.get('/users/:name', function(req, res){
  var name = req.params.name; 
  client.query('select name, content, tweets.id, pictureurl, tweets.userid from users join tweets on users.id = tweets.userid where name = $1', [name], function(err, results){
    if(err) return next(err);

    var tweets= results.rows;
    res.render('index',{title: 'Twitter.js - Posts by ' + name, tweets: tweets, name: name, showForm: true});
  })
  
});

router.get('/tweets/:id', function(req, res) {
  var id = req.params.id;
  client.query('select name, content, tweets.id, pictureurl from users join tweets on users.id = tweets.userid where tweets.id = $1',[id], function(err, results){
    if(err) return next(err);
    // console.log("results0 ==", results.rows)
    var tweets = results.rows;
    res.render( 'index', { title: 'Twitter.js - Post ID-'+id, tweets: tweets } );
  });

});



router.post('/tweets', function(req,res){
  	var name = req.body.name;
	var content = req.body.content;
  // console.log(req.body);
  // client.query('select id from users where name = $1', [name], function(err, results){
  //   if (err) return err;
  //   console.log(results)
  //   var userid = results.rows[0];

  client.query('insert into tweets (id,userid, content) values (default, (select id from users where name = $1), $2)',[name, content], function(err, results){
      if(err) return err;
      res.redirect('/');
  });
    
    // client.query('insert into tweets (id,userid, content)values (default, $1, $2)', [userid, content], function(err, results){
    //   if(err) return err;
    //   res.redirect('/');
    // });
  // })
  

	// tweetBank.add(name, content);
	// res.redirect('/');
})



module.exports = router;