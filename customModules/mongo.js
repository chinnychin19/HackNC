var MongoClient = require('mongodb').MongoClient;

var connectURI = require('../config.js').mongoConnectUri;

function addSubscription(username, subscription, callback) {
	MongoClient.connect(connectURI, function (err, db) {
		if (err) {
			throw err;
		}
		var collection = db.collection('accounts');
		collection.findOne({user:username}, function(err, doc) {
			if (err) throw err;
			doc.subscriptions.push(subscription);
			collection.save(doc, function(err, doc) {
				callback();
			});
		});
	})
}

function getSubscriptions(username, callback) {
	MongoClient.connect(connectURI, function (err, db) {
		if (err) {
			throw err;
		}
		var collection = db.collection('accounts');
		collection.findOne({user:username}, function(err, doc) {
			if (err) throw err;
			callback(doc.subscriptions);
		});
	})
}

function removeSubscription(username, teamName, callback) {
	MongoClient.connect(connectURI, function (err, db) {
		if (err) {
			throw err;
		}
		var collection = db.collection('accounts');
		collection.findOne({user:username}, function(err, doc) {
			if (err) throw err;
			var newSubs = [];
			for (var i in doc.subscriptions) {
				if (doc.subscriptions[i].name != teamName) {
					newSubs.push(doc.subscriptions[i]);
				}
			}
			doc.subscriptions = newSubs;
			collection.save(doc, function(err, doc) {
				callback();
			});
		});
	})
}

function getUsers(callback) {
	MongoClient.connect(connectURI, function (err, db) {
		if (err) {
			throw err;
		}
		var collection = db.collection('accounts');
		collection.find({}, function(err, docs) {
			if (err) throw err;
			callback(docs);
		});
	})
}

function addSummary(obj, callback) {
	MongoClient.connect(connectURI, function (err, db) {
		if (err) {
			throw err;
		}
		var collection = db.collection('summaries');
		collection.insert(obj, function(err, doc) {
			if (err) throw err;
		});
	})
}

function getSummaries(team, callback) {
	MongoClient.connect(connectURI, function (err, db) {
		if (err) {
			throw err;
		}
		var collection = db.collection('summaries');
		collection.find({name:team}, function(err, docs) {
			if (err) throw err;
			callback(docs);
		});
	})
}

exports.addSubscription = addSubscription;
exports.getSubscriptions = getSubscriptions;
exports.removeSubscription = removeSubscription;
exports.getUsers = getUsers;
exports.addSummary = addSummary;
exports.getSummaries = getSummaries;
