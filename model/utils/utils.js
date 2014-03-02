/* utils.js
*/
var jsdom = require("jsdom").jsdom;
var window = jsdom().parentWindow;
 String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
}

function isInArray (array, search)
{
    return (array.indexOf(search) >= 0) ? true : false; 
}

function clean_text(raw_input){
var div = window.document.createElement("div");
div.innerHTML = raw_input;
var decoded = div.firstChild.nodeValue; 
return decoded;
}