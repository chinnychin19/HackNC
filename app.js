
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

// var fs = require('fs');
// var teams = JSON.parse(fs.readFileSync('./model/espn/espnTeamIds.json'));
var teams = ["Atlanta Falcons",
"Buffalo Bills",
"Chicago Bears",
"Cincinnati Bengals",
"Cleveland Browns",
"Dallas Cowboys",
"Denver Broncos",
"Detroit Lions",
"Green Bay Packers",
"Tennessee Titans",
"Indianapolis Colts",
"Kansas City Chiefs",
"Oakland Raiders",
"St. Louis Rams",
"Miami Dolphins",
"Minnesota Vikings",
"New England Patriots"];

var espn = require('./model/espn/espn.js');
var yahoo = require('./model/ysports/ysports.js');
var textteaser = require('./customModules/textteaser.js');
var mongo = require('./customModules/mongo.js');
var mailer = require('./customModules/mailer.js');
var TIME_IN_HOUR = 1000*60*60;
var TIME_IN_DAY = 1000*30; // TODO: make correct figure

var numDay = 0;
// emailEveryone(numDay);
// setInterval(function(){
// 	numDay++;
// 	emailEveryone(numDay);
// }, TIME_IN_DAY);

addSummariesToDb();
setInterval(function() {
	addSummariesToDb();
}, TIME_IN_HOUR);

// TODO: get the summaries of the subscriptions from mongo
function emailEveryone(numDay) {
	mongo.getUsers(function(users) {
		users.each(function(err, user) {
			if (!user) return;
			console.log(user);
			mongo.getSubscriptions(user.user, function(subscriptions) {
				for (var i in subscriptions) {
					var sub = subscriptions[i];
					mongo.getSummaries(sub.name, function(summaries) {
						summaries.each(function(err, summary) {
							mailer.sendMail(user.email, JSON.stringify(summary));						
						});
					});
				}
			});
		});
	});
}


function addSummariesToDb() {
	var team = "Arizona Cardinals";
		console.log(team);
		espn.getESPNHeadlines(function(articles) {
			articles.forEach(function(val, index) {
				textteaser.getSummary(val.title, val.text, function(summary) {
					console.log(summary);
					var obj = {
						title : val.title,
						name : val.team,
						url : val.url,
						summary : summary
					};
					mongo.addSummary(obj);
				});
			});
		}, team);


	// yahoo.getYahooHeadlines(summarize(mongo.addArticles));
}

