import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Logs = new Mongo.Collection('logs');


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('logs', function logsPublication() {
    return Logs.find();
  });
}
//
// Meteor.methods({
//  'logs.insert'(text) {
//    check(text, String);
//
//
//
//    Logs.insert({
//      text,
//      createdAt: new Date()
//    });
//  },
//  'tasks.remove'(taskId) {
//    check(taskId, String);
//
//    Logs.remove(taskId);
//  },
//  'tasks.setChecked'(taskId, setChecked) {
//    check(taskId, String);
//    check(setChecked, Boolean);
//
//    Logs.update(taskId, { $set: { checked: setChecked } });
//  },
// });
