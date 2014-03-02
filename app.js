
//This app uses "Node.js Login Boilerplate": Copyright (c) 2013 Stephen Braitsch

var express = require('express');
var http = require('http');
var app = express();

app.configure(function(){
	app.set('port', 8080);
	app.set('views', './app/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
	app.use(express.bodyParser());
	app.use(express.json());       // to support JSON-encoded bodies
	app.use(express.urlencoded()); // to support URL-encoded bodies
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'super-duper-secret-secret' }));
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: './app/public' }));
	app.use(express.static('./app/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

require('./app/server/router')(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});



var mongo = require('./customModules/mongo.js');
var mailer = require('./customModules/mailer.js');
var TIME_IN_DAY = 1000*30;
var numDay = 0;
emailEveryone(numDay);
setInterval(function(){
	numDay++;
	emailEveryone(numDay);
}, TIME_IN_DAY);


// TODO: get the summaries of the subscriptions from mongo
function emailEveryone(numDay) {
	mongo.getUsers(function(users) {
		users.each(function(err, user) {
			if (!user) return;
			console.log(user);
			mongo.getSubscriptions(user.user, function(subscriptions) {
				mailer.sendMail(user.email, "Chinmay");
			});
		});
	});
}

