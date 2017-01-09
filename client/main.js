import angular from 'angular';
import angularMeteor from 'angular-meteor';

import board from '../imports/components/board/board';
import selector from '../imports/components/selector/selector';
import leaderboard from '../imports/components/leaderboard/leaderboard';
import notification from '../imports/components/notification/notification';

import '../imports/startup/accounts-config.js';
import './game.js';
import './controls.js';
 
angular.module('simple-todos', [
  angularMeteor,
  board.name,
  selector.name,
  leaderboard.name,
  notification.name,
  'accounts.ui'
]);

function onReady() {
  angular.bootstrap(document, ['simple-todos']);
}
 
if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
