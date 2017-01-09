import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Robots = new Mongo.Collection("robots");
 
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('robots', function robotsPublication() {
    return Robots.find({});
  });
}
 
Meteor.methods({

});