import { Robots } from '../imports/api/robots.js';
import { Answers } from '../imports/api/answers.js';
import { Board } from '../imports/api/board.js';

function Player() {
    Meteor.subscribe('answers');
    Meteor.subscribe('robots');

	this.robotList = [];
	this.backtrack = [];
	this.replay = [];
	this.current_round=0;

	var self=this;
	setTimeout(function() {self.tick();}, 500);
}

Player.prototype = {

	tick : function(){
		var self=this;
		//date
		var start = Answers.find({owner:"start"},{}).fetch()[0];
		var timer_start = Answers.find({owner:"timer_start"},{}).fetch()[0];
		var stop = Answers.find({owner:"stop"},{}).fetch()[0];

		if (typeof start != 'undefined'){
			if (this.current_round != start.createdAt.getTime()){
				this.current_round = start.createdAt.getTime()
				this.reset()
			}
		}
		setTimeout(function() {self.tick();}, 500);
	},

	//delete all moves
	reset : function () {
		console.log("reset")
		this.robotList = [];
		this.backtrack = [];
		this.replay = [];
		this.loadRobots();
		this.selectRobot(0);
	},

	loadRobots : function () {
		this.robotList = Robots.find().fetch()
	},

	stop : function () {

	},

	resume : function(){

	},

	selectRobot : function (id) {
		this.selected=undefined;
		for (var i=0; i<this.robotList.length; i++){
			var robot = this.robotList[i];
			
			robot.selected=false;
			if (robot.id==id){ 
				robot.selected=true;
				this.selected=id;
			}
		}
	},

	move : function(move){
		if (typeof this.selected == "undefined") return 0
		console.log(this.selected+" // "+move);

		this.replay.push([move, this.selected]);
		
		var r = this.robotList[this.selected];
		var bt = {x1: r.x, y1:r.y, color:r.color}
		
		r = this[move](r);
		bt.x2 = r.x
		bt.y2 = r.y
		
		this.backtrack.push(bt)
		this.checkTarget()
	},

	left : function(r){
		if (this.getWall(r.x,r.y).left && this.checkCase(r.x-1,r.y) ){
			r.x--;
			return this.left(r);
		}
		return r;
	},
	
	right : function(r){
		if (this.getWall(r.x,r.y).right && this.checkCase(r.x+1,r.y) ){
			r.x++;
			return this.right(r);
		}
		return r;
	},
	
	up : function(r){
		if (this.getWall(r.x,r.y).up && this.checkCase(r.x,r.y-1) ){
			r.y--;
			return this.up(r);
		}
		return r;
	},
	
	down : function(r){
		if (this.getWall(r.x,r.y).down && this.checkCase(r.x,r.y+1) ){
			r.y++;
			return this.down(r);
		}
		return r;	
	},
	
	//check if the position x/y is inside the board and don't contain already a robot'
	checkCase : function(x,y) {
		if (x > Board.length-1 || x < 0 || y > Board.length-1 || y < 0) return false
		for (var i=0; i<this.robotList.length; i++){
			var r = this.robotList[i]
			if (r.x==x && r.y ==y) return false
		}
		return true
	},

	//check walls around a position x/y
	getWall : function (x,y) {
		var c = {left:true,right:true,up:true,down:true}
		if (Board[y][x*2] == '|') c.left=false;
		if (Board[y][2+(x*2)] == '|') c.right=false;
		if (Board[y][1+(x*2)] == '_') c.down=false;
		if (y==0 || (Board[y-1][1+(x*2)] == '_') ) c.up=false;
		return c
	},

	run_replay : function(replay,n){
		//first move => reset robots positions/backtrack lines
		if (n==0){
			this.backtrack=[];
			this.loadRobots();
			console.log(n)
		}

		//last move => reset
		if (typeof replay[n]=="undefined") {
			this.reset();
			return 0;
		}

		//replay move number n
		var move = replay[n]
		console.log(move);
		
		this.selectRobot(move[1])
		var r = this.robotList[this.selected];
		var bt = {x1: r.x, y1:r.y, color:r.color}
		r = this[move[0]](r);
		bt.x2 = r.x
		bt.y2 = r.y
		this.backtrack.push(bt)

		//schedule next move
		var self=this;
		setTimeout(function(){self.run_replay(replay,n+1)}, 500)
	},

	//
	checkTarget: function(r){
		for (var i=0; i<this.robotList.length; i++){
			var r=this.robotList[i];
			if (typeof r.tx != "undefined" && r.tx != null){
				if (r.tx!=r.x || r.y!=r.ty) return false;
			}
		}
		console.log("victory ! ("+this.replay.length+")");
		Meteor.call('answers.insert', this.replay);
		var self=this;
		setTimeout(function(){self.run_replay(self.replay,0)}, 1000);
		return true;
	}
}


export const Game = new Player()