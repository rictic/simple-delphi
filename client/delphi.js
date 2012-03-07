/**
 * This is the code that should be shared by all delphi apps.
 */

var question_id;
/**
 * This is the function that the delphi app calls to return a judgment
 */
var submitJudgment = function(judgment) {
  if (top != self) { // we are embedded in an iframe
    pm({
      target: window.parent,
      type: "judgment",
      data: {
        "question_id" : question_id,
        "judgment" : judgment
      }
    });
  } else { // we are by running standalone so just log
    if (typeof console == "object") {
      console.log(judgment);
    }
  }
};

// the app load this script after a jquery is already instantiated in the page
// so we need to make sure we don't leak our own version into the outside scope
var delphiJQuery = jQuery.noConflict(true);

function callClient(fname, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (typeof window[fname] === "function") {
    window[fname].apply(null, args);
  }
}

// when the DOM is ready, load things
delphiJQuery(document).ready(function() {
  if (typeof window.main == "function") {
    window.Delphi = {
      "submitJudgment" : submitJudgment
    };

    if (window.top != self) { // we are embedded in an iframe
      pm.bind("acceptConfiguration", function(configs) {
        window.configs = configs;
        callClient("acceptConfiguration", window.configs)
      });

      // register the question handler
      pm.bind("question", function(question) {
        window.question = question;
        question_id = question.question_id;
        callClient("main", window.question);
      });

      var question_id = window.location.hash.substring(1);
      // tell delphi we're ready to roll
      pm({
        target: window.parent,
        type: "ready",
        data: question_id
      })
    } else {
      if (typeof window.question != "undefined" && typeof window.configs != "undefined") {
        callClient("acceptConfiguration", window.configs);
        callClient("preloadQuestion", window.question);
        callClient("main", window.question);
      } else {
        alert("There are no 'question' and 'configs' object to test the app with");
      }
    }
  } else {
    alert(
      'A delphi app has to specify at least a function called ' +
      '"main(question)" that will receive the question '
    );
  }
})
