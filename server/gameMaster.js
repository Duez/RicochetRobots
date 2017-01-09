import { Meteor } from 'meteor/meteor';
import { Robots } from '../imports/api/robots.js';
import { Answers } from '../imports/api/answers.js';
import { Board } from '../imports/api/board.js';
import '../imports/api/robots.js';

const Targets = [
	{x:5, y:2},
	{x:13, y:1},
	{x:9, y:3},
	{x:2, y:4},
	{x:14, y:4},
	{x:7, y:5},
	{x:1, y:6},
	{x:12, y:6},
	{x:4, y:9},
	{x:13, y:9},
	{x:1, y:6},
	{x:3, y:14},
	{x:13, y:1},
	{x:14, y:13},
	{x:14, y:4},
	{x:13, y:9}
]

const Color = ["#C20A05","#C2BD05","#590C8A","#04A50E"];

function GameMaster() {
	var self=this;
	//tick
	Meteor.setTimeout(function(){self.tick()},500)
}

GameMaster.prototype = {

	tick : function(){
		var self=this;
		//date
		var now = new Date();
		var start = Answers.find({owner:"start"},{}).fetch()[0];
		var timer_start = Answers.find({owner:"timer_start"},{}).fetch()[0];
		var stop = Answers.find({owner:"stop"},{}).fetch()[0];

		//a round is currently running ...
		if ((typeof start!= "undefined") && (typeof stop=="undefined")){
			//...and the time limit has been reached
			if ((typeof timer_start != "undefined") && (now-timer_start.createdAt)>60000){
				Answers.insert({owner:"stop", createdAt:now});
				//next round start in 30s
				Meteor.setTimeout(function(){self.startRound()},30000);
			}
		}
		
		//tack tock tuck
		Meteor.setTimeout(function(){self.tick()},500);
	},

    reset : function () {
		Answers.remove({});
		this.resetRobots();
	},

	resetRobots : function(){
		Robots.remove({});
		var robotsList=[];
		
		for (var i=0; i<Color.length; i++){
			var robot;

			while (!this.checkRobot(robot, robotsList) ){
				robot = {
					id: i,
					x: Math.floor(Math.random()*16),
					y: Math.floor(Math.random()*16),
					color: Color[i]
				}
			}
			robotsList.push(robot);
		}

		for (var i=0; i<robotsList.length; i++){
			var robot = robotsList[i];
			Robots.insert(robot);
		}
	},

	startRound: function (){
		this.start = new Date();
        var rl = Robots.find().fetch();

        //remove previous answers
        Answers.remove({});

        //reset robots
		//TODO keep position of the robots from  the previous round
		this.resetRobots();

        //select a random robot
        var id = rl[Math.floor(Math.random()*rl.length)].id;

        //select a random target 
        target = Targets[Math.floor(Math.random()*Targets.length)];
        while(!this.checkCase(rl,target.x,target.y)){
            target = Targets[Math.floor(Math.random()*Targets.length)];
        }
        //set up the target
        Robots.update({id: id}, { $set: {tx:target.x, ty:target.y} });
		//set up the first answer 
		Answers.insert({createdAt: this.start,owner: "start"})
    },

    checkRobot: function(r, rl) {
        if (typeof r == "undefined") return false
        
        for (var i=0; i<rl.length; i++) {
            if ( r.x == rl[i].x && r.y == rl[i].y) return false;	  
        }
        
        if (r.x==7 && r.y==7) return false;
        if (r.x==7 && r.y==8) return false;
        if (r.x==8 && r.y==7) return false;
        if (r.x==8 && r.y==8) return false;		   
        
        return true;
    },

    checkCase : function(rl,x,y) {
		if (x > Board.length-1 || x < 0 || y > Board.length-1 || y < 0) return false
		for (var i=0; i<rl.length; i++){
			var r = rl[i]
			if (r.x==x && r.y ==y) return false
		}
		return true
	},

}

export const GM = new GameMaster()