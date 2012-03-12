goog.provide("delphi.main");

//TODO: remove these lines
goog.require("goog.net.XhrLite");
goog.require("goog.Uri");
goog.require("goog.debug.ErrorHandler");


goog.require("delphi.Task")
goog.require("delphi.Session");
goog.require("delphi.Question");

delphi.main = function main() {

}

function next_question() {
  delphi.Task.getAssignedTasks().onCallback(function(tasks) {
    if (tasks.length === 0) {
      setTimeout(next_question, 1000);
    }
    task = chooseTask(tasks);
    delphi.Session.getSession(task).onCallback(function(session) {

    });
  });
}

function chooseTask(tasks) {
  return tasks[0];
}
