goog.provide("delphi.Session");

goog.require("goog.async.Deferred");
goog.require("goog.async.DeferredList");

goog.require("delphi.Task");
goog.require("delphi.util");

var u = delphi.util;

/**
  * @constructor
  * @param {!string} id
  * @param {!delphi.Task} task
  */
function Session(id, task) {
  this.id = id;
  this.questions = [];
  Session.active_sessions[id] = this;
  Session.from_task[task.unguessable_id] = this;
}
Session.active_sessions = {};
Session.from_task = {};
Session.NUM_PRELOAD = 5;

/** @param {!delphi.Task} task */
Session.getSession = function getSession(task) {
  if (task.unguessable_id in Session.from_task) {
    return Session.from_task[task.unguessable_id];
  }
  return Session.startSession(task);
}

/** @param {!delphi.Task} task */
Session.startSession = function startSession(task) {
  return u.transformDeferred(u.postJson("/apis/start_session", {group: task.unguessable_id}), function(session_id) {
    return new Session(session_id, task);
  });
}

/**
 * @returns {goog.asnc.Deferred} of a single delphi.Question
 */
Session.prototype.getQuestion = function getQuestion() {
  var self = this;
  var question = this.questions[0];
  var d = this.fetchQuestions();
  if (question !== undefined) {
    return goog.async.Deferred.succeed(this.questions.shift());
  }
  var result = new goog.async.Deferred();
  d.onCallback(function() {
    result.callback(self.questions);
  });
  return result;
}

/**
 * Fetches questions and adds them to this.questions.
 * Attempts to fetch enough questions such that
 * this.questions.length === Session.NUM_PRELOADED
 *
 * @returns {goog.async.Deferred} which is called once there is at least one
 *                                question in this.questions
 */
Session.prototype.fetchQuesions = function fetchQuestions() {
  var result = new goog.async.Deferred();
  var self = this;
  function fetch() {
    if (self.questions.length > 0 && result) {
      result.callback();
      result = false;
    }
    var num = Math.min(0, Session.NUM_PRELOAD - self.questions.length);
    if (num === 0) {
      return;
    }
    u.getJson("/apis/get_question", {session: self.id, num: num})
      .onCallback(function(result) {
        var new_questions = goog.array.map(result.question_ids, function(question_id) {
          return new delphi.Question(question_id, self);
        })
        self.questions = self.questions.concat(new_questions);
        //fetch more if needed
        setTimeout(fetch, 1 * 1000);
      });
  }
  fetch();

  return result;
}

delphi.Session = Session;
