
//sports yahoo
/*
All the main headlines are contained in a li list-story 

*/
var keywords = [];
var nodeIO = require('node.io');
var jsdom = require("jsdom").jsdom;
var window = jsdom().parentWindow;
var numArticles = 4;
var params = [];
//var baseYahoo = getBase('http://sports.yahoo.com/', params); // need to build a way of changing the base of the reqest to check the headlines of specific pages
var baseYahoo = 'http://sports.yahoo.com'; 
//var yahooArticles = []; 
/*
Inputs: Params that decide which subsection of sports yahoo to look in.
*/
function getArticles(callback){
  var base = determineBaseURL(params);
  //Step 2: call initYahoo using (baseURL)
  initYahoo(base, callback);
  

}
function determineBaseURL(search_params){
  return 'http://sports.yahoo.com';
}

function initYahoo(base,callback){
//  yahooArticles = [];
nodeIO.scrape(function() {    
    this.getHtml(base, function(err, $){
      var listToBePopulated = [];
      getYahooHeadlines(err, $, base, listToBePopulated, callback);
    });  
});
}
//inputs: li element 
//outputs: the first anchor tag to another page.
function findLink(element){
//console.log(element["children"][0]);
if (element == null)
  return "";
if (element["children"][0]["name"] == "a")
    return element["children"][0]["attribs"]["href"]
else return findLink(element["children"][0]);
}
function getYahooHeadlines(err, $, base, listToBePopulated, callback){
  $('.list-story').each(function(title) { 
   // var refLink = title["children"][0]["children"][0]["attribs"]["href"] // get to the a tag of yahoo headlines
   var refLink = findLink(title);

   if (refLink != ""){
    var pageUrl;
    if (refLink[0] == 'h'){ //completely non-native link to external site -- if we were getting paid more or at all, we'd implement for this
      pageUrl = "";
    }
    else{
      pageUrl = baseYahoo + refLink;
      processYahooPage(pageUrl, listToBePopulated, callback);     
    }
      
  }
  });           
}
function processYahooPage(pageUrl, listToBePopulated, callback){
  nodeIO.scrape(function() {
  this.getHtml(pageUrl, function(err, $){
    getYahooPageContent($, pageUrl, listToBePopulated, callback);
  });
});
}

function getYahooPageContent($, pageUrl, listToBePopulated, callback){
  
  var articleText = ""; // set to the final text
  $('p').each(function(p_raw){ //switch to each when done looking
   
   if(p_raw['attribs'] == null){
        p_raw["children"].each(function(inner) {
        var raw_text;
        //must clean out that text for any HTML special chars, and <a> elements
        if (inner["type"] != "text"){
          if (inner["name"] == "a")
            var child= inner["children"][0];
            //console.log(child.raw)
            raw_text =  child.raw;
        }
       // console.log(inner);
        else{
          raw_text = inner.innerHTML;
        } 

        articleText += " " + clean_text(raw_text);
        //articleText is the final, processed yahoo article.              
   });
    } 
  });
//console.log(articleText);
listToBePopulated.push(articleText);
if(listToBePopulated.length == numArticles){
  callback(listToBePopulated);
}

}


function clean_text(raw_input){
var div = window.document.createElement("div");
div.innerHTML = raw_input;
var decoded = div.firstChild.nodeValue; 
return decoded;
}

//test.
exports.getYahooHeadlines=getArticles;


