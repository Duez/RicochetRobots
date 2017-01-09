import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Robots } from '../../api/robots.js';
import { Board } from '../../api/board.js';
import { Game } from '../../../client/game.js';
import template from './board.html';

 
class BoardCtrl {
  constructor($scope) {
    $scope.viewModel(this);
    this.subscribe('robots');

    this.helpers({

    })

    //P5js canvas
    this.canvas = document.getElementById("canvas");
    this.sketch = new p5(this.sketchProc, this.canvas);

    //hammerjs touch controls
    var myElement = document.getElementById('board');
    var hammer = new Hammer(myElement);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on("swipeleft", function() { Game.move('left') });
    hammer.on("swiperight", function() { Game.move('right') });
    hammer.on("swipeup", function() { Game.move('up') });
    hammer.on("swipedown", function() { Game.move('down') });
  }

  //P5 sketch function
  sketchProc(p) {
    var self = this

    //setup board size equal to the canvas size
    //TODO catch onresize 
    p.setup = function() {
      p.counter = 0;

      var width = document.getElementById("canvas").offsetWidth;
      p.sw = width/Board.length;

      p.createCanvas(Board.length*p.sw, Board.length*p.sw);
    }
    
    //draw the chessboard squares
    p.drawGrid = function(){
      p.stroke(60,60,60,255)
      p.fill(70,70,70,255)
      p.strokeWeight(1);
      
      for (var i=0; i<Board.length; i++){
        for (var j=0; j<Board.length; j++){
          p.rect(2+(i*p.sw),2+(j*p.sw),p.sw*0.9,p.sw*0.9)
        }
      }	
    }
    
    //add the walls
    p.drawWall = function(){
      p.stroke(155,155,155,255)
      p.fill(155,155,155,255)
      p.strokeWeight(3);
      
      for (var i=0; i<Board.length; i++){
        for (var j=1; j<Board.length+1; j++){
          
          if (Board[i][j*2] == '|'){
            p.line(j*p.sw, i*p.sw, j*p.sw, (i+1)*p.sw)	
          }
          if (Board[i][(j*2)-1] == '_'){
            p.line((j-1)*p.sw, (i+1)*p.sw, (j)*p.sw, (i+1)*p.sw)	
          }
        }
      }	
    }
    
    p.drawRobots = function(){
      var rl = Game.robotList;
      p.strokeWeight(1);
      
      for (var i=0; i<rl.length; i++){
        var robot = rl[i];

        p.stroke(robot.color)
        p.fill(robot.color)
        
        if (robot.selected){
          var xt = robot.x*p.sw+p.sw/2;
          var yt = robot.y*p.sw+p.sw/2;
          var r = p.PI*p.counter/60;

          p.translate(xt, yt);
          p.rotate(r);
          p.rect(-p.sw*0.4, -p.sw*0.4, p.sw*0.8,p.sw*0.8)
          p.rotate(-r);
          p.translate(-xt, -yt);
        }else{
          p.rect(p.sw*0.2+robot.x*p.sw, p.sw*0.2+robot.y*p.sw, p.sw*0.6,p.sw*0.6)
        }
      }
    }
    
    //draw a line for each robot's move saved in Game.backtrack
    p.drawBackTrack = function(){
      var bt=Game.backtrack;
      p.strokeWeight(2);
      
      for (var i=0; i<bt.length; i++){
        p.stroke(bt[i].color)
        p.fill(bt[i].color)
        p.line(15+bt[i].x1*p.sw, 15+bt[i].y1*p.sw, 15+bt[i].x2*p.sw, 15+bt[i].y2*p.sw)
      }
    }

    //
    p.drawTarget = function() {
      var rl = Game.robotList;
      p.strokeWeight(2);

      for (var i=0; i<rl.length; i++){
        var robot = rl[i]

        if (typeof robot.tx != "undefined" && robot.tx != null){
          p.stroke(robot.color)
          p.noFill()
          p.ellipse(robot.tx*p.sw+p.sw/2, robot.ty*p.sw+p.sw/2, p.sw*0.7,p.sw*0.7)
          p.ellipse(robot.tx*p.sw+p.sw/2, robot.ty*p.sw+p.sw/2, p.sw*0.45,p.sw*0.45)
          p.ellipse(robot.tx*p.sw+p.sw/2, robot.ty*p.sw+p.sw/2, p.sw*0.2,p.sw*0.2)
        }
      }
    }
    
    //main draw,
    p.draw = function() {
        p.counter++;
        p.background(35,35,35)
        p.drawGrid()
        p.drawWall()
        p.drawBackTrack()
        p.drawRobots()
        p.drawTarget()
    };
  }
}
 
export default angular.module('board', [
  angularMeteor
])
  .component('board', {
    templateUrl: 'imports/components/board/board.html',
    controller: BoardCtrl
  });