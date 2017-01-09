import { Meteor } from 'meteor/meteor';
import { GM } from './gameMaster.js';
import '../imports/api/robots.js';
import '../imports/api/answers.js';
import '../imports/api/board.js';

Meteor.startup(() => {
  GM.reset();
  GM.startRound();
/*
  if(typeof someCollection.findOne() === 'undefined') {
    someCollection.insert(...);
  }
*/
});

