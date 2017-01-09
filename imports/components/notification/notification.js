import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Answers } from '../../api/answers.js';
import template from './notification.html';
 
class NotificationCtrl {
  constructor($scope, $timeout) {
    $scope.viewModel(this);
    $scope.tickInterval = 1000;
    $scope.mes="waiting for server ..."

    TimeSync.resync();
    this.subscribe('answers');
    
    setInterval(function(){$scope.$apply()}, 500);
    
    var tick = function() {
        var start = Answers.find({owner: "start"}).fetch()[0];
        var timer_start = Answers.find({owner: "timer_start"}).fetch()[0];
        var stop = Answers.find({owner: "stop"}).fetch()[0];

        if (typeof start!= 'undefined' && typeof stop=="undefined")
            $scope.mes="round in progress"
        
        if (typeof timer_start!= 'undefined')
            $scope.mes="round ending, hurry up!"
        
        if (typeof stop!= 'undefined')
            $scope.mes="waiting for next round"

        if (!Meteor.userId()) {
            $scope.mes="you must login first to play"
        }
        
        $timeout(tick, $scope.tickInterval);
    }
    $timeout(tick, $scope.tickInterval);


    this.helpers({
      all_answers() {
        return Answers.find({move_count:{$lt:1000}})
      }
    })
  }


}
 
export default angular.module('notification', [
  angularMeteor
]).component('notification', {
    templateUrl: 'imports/components/notification/notification.html',
    controller: NotificationCtrl
  });