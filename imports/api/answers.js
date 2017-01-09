import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Robots } from './robots.js';
import { Board } from './board.js';

//target position
export const Answers = new Mongo.Collection("answers");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('answers', function answersPublication() {
    return Answers.find({});
  });
}
 
Meteor.methods({
    'answers.init' () {
			Answers.remove();
    },

    'answers.insert' (replay) {
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

		//date
		var now = new Date();
		var game_start = Answers.find({owner: "start"}).fetch()[0].createdAt;

		//check if the solution has been submitted before the time limit
		var timer_start = Answers.find({owner:"timer_start"},{}).fetch()[0];
		if (typeof timer_start!= "undefined" && ((now-timer_start.createdAt) >60000) ) return 0;

		//build the solution to insert
		var a = {
			replay: replay,
			move_count: replay.length,
			createdAt: now,
			total_time: now-game_start,
			owner: Meteor.userId(),
			username: Meteor.user().username
		}

		//add a flag for the first answer
		if (Answers.find({}).fetch().length==1){
			Answers.insert({owner:"timer_start", createdAt:now});
		}

		//insert or update the previous solution from this player
		var b = Answers.find({username: Meteor.user().username}).fetch()[0];
		if (typeof b == "undefined") {
			Answers.insert(a);
		}else{
			if (a.move_count<b.move_count) Answers.update({username: Meteor.user().username},a);
		}
  },
});
