var unirest = require('unirest');

// var title = "Memo to fans: Storm court at own risk";
// var text = "Thursday night's melee following Utah Valley's 66-61 overtime victory against New Mexico State was a bad moment for everyone involved. Coaches. Fans. Players. Team officials. Everyone. It's only right that K.C. Ross-Miller was suspended Friday for hurling a basketball at Holton Hunsaker in the final seconds -- the incident that cooked up all of the postgame craziness. But the punitive measures should extend beyond that. The other players and fans who escalated the action should be reprimanded, too. That probably will take some time to sort out. But the incident added a layer of credibility to the collective stance of the folks who want a ban on court storming. At the same time, how many fights typically follow the dozens of court stormings we see each season? There are, however, legitimate concerns about hundreds and thousands of fans avalanching onto the court. There is something else, however, that should be addressed in all of this. And it's important for fans to take note of it. If you decide to run onto that gridiron, that court, that field of play in the hectic, emotional postgame frenzy that tends to accompany high-octane matchups, you might get punched. Yes, punched. The proliferation of social media interaction between athletes and fans has created the illusion that the latter crew can do whatever it wants to players and escape without consequence. Words alone should never change that. Players and coaches are subjected to vitriol that few can comprehend. And they're compensated, albeit through scholarship or salary, to ignore the nonsense. But what happens when things turn physical or a fan invades the personal space of an athlete on a court that's supposed to act as a buffer so that the face-to-face confrontation we witnessed Thursday night is avoided? Even in that scenario, players and coaches should still run from the chaos. The consequences are too great. But that doesn't mean they will. And fans must realize this. Remember, this was not the Marcus Smart-Jeff Orr situation. Nah, this was different. That was an unjustifiable shove in response to words. Thursday night's mess was a Friday night bar fight. It was all wrong but understandable. If you see punches thrown at teammates and friends in the middle of what looked like a 200 vs. 10 scenario, what would you do? Not, what are you supposed to do? What would you actually do? New Mexico State was wrong. One of its players started the whole thing, but when order is abandoned, bad things happen. That's what spectators must understand. Those Utah Valley supporters turned a hurled ball into a powder keg. You have to stay off the court in those situations and let authorities deal with it. Or, you might get punched for trying to play Batman against a 6-foot-7 basketball player with a mean jab. It's unclear if fans were injured or hurt in the scrum. But those Utah Valley backers who threw punches at players Thursday were acting according to the false shield of invincibility that social media has promoted. I can do what I want and you can’t do anything about it. That's the way it should be under normal circumstances. Athletes have to take it. But there is nothing normal about a sea of opposing fans surrounding a group of young men who have every reason to get defensive, especially if things get physical. And that's what happened Thursday with a group of fans who probably didn't realize how vulnerable they were. As bad as it was, it could have devolved into a Pistons-Pacers situation. Officials on the floor did a good job of jumping into the mix and clearing the floor as quickly as they could. Some fans from Utah Valley threw punches as NMSU players were being pulled away from the fight. You can see it on the viral video of the event. They're cowards, just like the tough guys who talk a big game through Twitter and Facebook but would freeze up if they encountered the recipient of their ire on the street.";
// getSummary(title, text, console.log);

function getSummary(title, text, callback) {
	var Request = unirest.post("https://textteaser.p.mashape.com/api")
		.headers({ 
			"X-Mashape-Authorization": "ma0uUxtU8B4QOInJrppMJWtQeVn0DArz"
		})
		.send({ 
			"text": text,
			"title": title,
			"category": "Sports",
		})
		.end(function (response) {
			var obj = {
				title: response.body.title,
				summary: response.body.sentences.join(" "),
			}
			callback(obj);
		});
}

exports.getSummary = getSummary;