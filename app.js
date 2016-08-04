var express = require('express');
var chalk = require ('chalk');
var swig = require ('swig');

var app = express();


app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({ cache: false });

var routes = require('./routes/');
app.use('/', routes);

// app.use(express.static('views'));
app.use(express.static('public'));

app.use(function(req, res, next) {
	console.log(chalk.red(req.method) + ' ' + chalk.blue(req.path) + ' ' + chalk.green(res.statusCode));
	next();
});





app.listen(3000, function() {
	console.log("server listening on Port 3000");
});