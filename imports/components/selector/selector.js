import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Robots } from '../../api/robots.js';
import { Game } from '../../../client/game.js';
import template from './selector.html';

 
class SelectorCtrl {

  constructor($scope, $interval) {
    $scope.viewModel(this);
 
    this.subscribe('robots');
 
    this.helpers({
      robots() {
        return Robots.find({}, {});
      }
    })
  }

  select(id) {
    Game.selectRobot(id);
  }

  reset() {
    Game.reset();
  }

}
 

export default angular.module('selector', [
  angularMeteor
])
  .component('selector', {
    templateUrl: 'imports/components/selector/selector.html',
    controller: SelectorCtrl
  });