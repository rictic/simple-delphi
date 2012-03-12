goog.provide("delphi.Task")
goog.require("delphi.util");

var u = delphi.util;

/**
 * @constructor
 */
delphi.Task = function Task(unguessable_id) {
  this.unguessable_id = unguessable_id;
  this.getDetails(); //primes the cache
}

delphi.Task.getAssignedTasks = function getAssignedTasks() {
  return u.transformDeferred(u.getJson("/apis/get_groups"), function(unguessable_ids) {
    var result = [];
    for (var i = 0; i < unguessable_ids.length; i++) {
      result.push(new delphi.Task(unguessable_ids[i]));
    }
    return result;
  });
}

delphi.Task.prototype.getDetails = function getDetails() {
  return u.getJson("/apis/get_task_details");
}

