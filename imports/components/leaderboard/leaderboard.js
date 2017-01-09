import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Answers } from '../../api/answers.js';
import { Game } from '../../../client/game.js';
import template from './leaderboard.html';
 
class LeaderboardCtrl {
  constructor($scope, $timeout) {
    $scope.viewModel(this);
    $scope.Game = Game;
    $scope.$watch('Game');
    $scope.clock = "loading clock...";
    $scope.tickInterval = 1000;
    $scope.time_left = "60s";
    TimeSync.resync();

    this.subscribe('robots');
    this.subscribe('answers');
    this.Game = Game; 

    setInterval(function(){$scope.$apply()}, 100);
    
    var tick = function() {
        var now = TimeSync.serverTime();
        var start = Answers.find({owner: "start"}).fetch()[0];
        var timer_start = Answers.find({owner: "timer_start"}).fetch()[0];
        var stop = Answers.find({owner: "stop"}).fetch()[0];

        if (typeof start!= 'undefined' && typeof stop=="undefined")
            $scope.clock = "time elapsed "+((now-start.createdAt)/1000).toFixed(0)+"s";

        if (typeof stop!= 'undefined')
            $scope.clock = "next round in "+(30-(now-stop.createdAt)/1000).toFixed(0)+"s";
        
        if (typeof timer_start!= 'undefined'){
            var timer = (60-(now-timer_start.createdAt)/1000);
            if (timer<0) timer=0
            $scope.time_left = timer.toFixed(0);
        }else
            $scope.time_left = "60s";
        
        $timeout(tick, $scope.tickInterval);
    }
    $timeout(tick, $scope.tickInterval);


    this.helpers({
      all_answers() {
        var a = Answers.find(
          {move_count:{$lt:1000}},
          {sort:{move_count:1, total_time:1}}
          ).fetch()
        return a
      },
      short_answers() {
        var a = Answers.find(
          {move_count:{$lt:1000}},
          {sort:{move_count:1, total_time:1}}
          ).fetch();
        return a.slice(0,2);
      }
    })
  }

  move_count() {
    return this.Game.replay.length;
  }
}
 
export default angular.module('leaderboard', [
  angularMeteor
]).component('leaderboard', {
    templateUrl: 'imports/components/leaderboard/leaderboard.html',
    controller: LeaderboardCtrl
  });