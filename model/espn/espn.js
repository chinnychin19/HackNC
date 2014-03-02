/*
testEspn.js 
It is what you think it is.
*/
/*
Hardcoded for NFL. This is a hackathon, and I can only go without sleep for so long.
Actually lies I have unlimited coffee.
*/
//Move to init file. Life is horrible that this didn't work originally.
 String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
}

 function isInArray(array, search){
    return (array.indexOf(search) >= 0) ? true : false; 
}

var config = require('../../config.js');
var unirest = require("unirest");
var nodeIO = require("node.io");
var fs = require("fs");


var jsdom = require("jsdom").jsdom;
var window = jsdom().parentWindow;

var espnTeamIds = require("./espnTeamIds.json");
var myTeams = ["Arizona Cardinals", "Miami Dolphins"]; // need to get from external file
var settings = {"myTeams:" : myTeams, "numResults": 3}; 
var APIKEY = config.espnAPI;
var SECRET = config.espnSecret;
var espnArticles = [];
var espnHeadlines = [];
//default call
function getESPNHeadlines(callback){
	initESPN(callback);
	/*var titlesText = {};
	for(var i in espnArticles){
		var key = espnHeadlines[i]
		console.log(key);
		//titlesText[key] = espnArticles[i];
	}
	console.log(titlesText);*/
	//console.log(espnArticles)
	//for(var headline in espnHeadlines);
	//return titlesText;
	}
function initESPN(callback){

var ESPN = unirest.get("http://api.espn.com/v1/sports/football/nfl/news/?disable=mobileStory%2Caudio&limit="+settings['numResults']+"&apikey=" + APIKEY)
.headers({ 
    "X-Mashape-Authorization": "5G3CQhAh3RChs4M6jV01J5ga5cVQC3rp"
  })
  .end(function (response) {
  	var listToBePopulated = [];
    var articlesToScrape = filter(response["body"]["headlines"]);
    for (var article in articlesToScrape){
    	var headline = articlesToScrape[article]["headline"];
    	espnHeadlines[article] = headline;
    
    }
   scrapeArticles(articlesToScrape, listToBePopulated, callback);
  });	
}
var image_base_url = "http://a1.espncdn.com/prod/assets/clubhouses/2010/nfl/bg_elements/teamlogos/"; //+ abbrev + .png
function getTeamInformation(){

var images = unirest.get("http://api.espn.com/v1/sports/football/nfl/teams/?apikey="+APIKEY).headers({
	"X-Mashape-Authorization": "5G3CQhAh3RChs4M6jV01J5ga5cVQC3rp"
}).end(function(response){
// console.log(response);
var allTeams = response["body"].sports[0].leagues[0].teams;
var data = {};
for (var team in allTeams){
	var teamId = allTeams[team].id;
	var teamName = allTeams[team].location + " " + allTeams[team].name;
	console.log(teamName)
	var img = image_base_url+allTeams[team].abbreviation+".png";
	data[teamName] = {"id": teamId, "img" : img};
}
//var parse = JSON.stringify(data);
fs.writeFile("espnTeamIds.json", JSON.stringify(data), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 
});


}
//get link to article. 
//Article text is all in .article p
function scrapeArticles(articlesToScrape, listToBePopulated, callback){
	//console.log(articlesToScrape);
	for (article in articlesToScrape){		
		var pageUrl = articlesToScrape[article]["links"]["web"]["href"];
		getEspnHtml(pageUrl, listToBePopulated, articlesToScrape.length, callback);		
	}

}

function getEspnHtml(pageUrl, listToBePopulated, numArticles, callback){
	nodeIO.scrape(function() {    
    this.getHtml(pageUrl, function(err, $){
      if(err)
      	console.log("Error", err)
     var html = getEspnArticle(err,$, listToBePopulated, numArticles, callback);
     
    });  
});
}
function getEspnArticle(err, $, listToBePopulated, numArticles, callback){
	//console.log("call ");
	var articleText = "";
	var raw_text = "";
	$(".article p").each(function(raw_p){
		raw_text += processParagraph(raw_p);
	})
	articleText = clean_text(raw_text);
	listToBePopulated.push(articleText);
	if (listToBePopulated.length == numArticles){
		callback(listToBePopulated);
	}
}
function processParagraph(raw_p){
	var raw_text = "";
	if(raw_p.attribs == null){ //paragraphs with text
		if(raw_p.children != null){ //no children --> no information inside
			//console.log(raw_p.children);
			if (raw_p.children.length > 1){ //weird embedded node
			for (var child in raw_p.children){ 		//go through each individual node, get all children and append them to string
				raw_text = getAllChildren(raw_p.children);
			}
		}
			else{
				raw_text += raw_p.children[0].raw;
			} 
		}
		
	}
return raw_text;
}
function getAllChildren(node){
var childStr = "";
for (var field in node){
	if(node[field].type == "text"){
		childStr += node[field].raw;
	}
	else{
		if (node[field].type == "tag"){
			childStr += node[field].children[0].raw;
		}
	}
}
//there is a node with <a> in it

return childStr;
}

function clean_text(raw_input){
	if(raw_input == "")
		return "";
var div = window.document.createElement("div");
div.innerHTML = raw_input;
var decoded = div.firstChild.nodeValue; 
return decoded;
}


function initSettings(teams, results){
initTeams();
settings["myTeams"] = teams;
settings["numResults"] = results;
}
/*
Inputs: All the articles originally pulled down by the ESPN API
Outputs: The articles related to our specific teams 
*/
function filter(articles){
	var raw_articles = [];
	for (var a in articles){
		var article = articles[a];
		for (var cat in article["categories"]){
			for (var team in myTeams){
				var description = article["categories"][cat]["description"];
				//console.log(typeof(description))
				for (var team in myTeams){					
				if (description.contains(myTeams[team]) && !isInArray(raw_articles, article))
						raw_articles.push(article);
				}
			}
		}
			//console.log(article["categories"][cat]);

	}
	return raw_articles;
}
exports.getESPNHeadlines=getESPNHeadlines;
//callback is needed 
//getTeamInformation();
