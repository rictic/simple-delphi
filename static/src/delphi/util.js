goog.require("goog.net.XhrManager");
goog.require("goog.async.Deferred");

goog.provide("delphi.util");

var net_manager = new goog.net.XhrManager(10);
var net_id_counter = 0;

//FIXME(rictic): this code is surely already somewhere, I just can't find it
/** @param {Object.<string, number|string>} params the params to encode
  * @returns {string} the params as a form-encoded string
  */
function formEncode(params) {
  var encoded = [];
  for (var name in params) {
    encoded.push(encodeURIComponent(name) + "=" + encodeURIComponent("" + params[name]));
  }
  return encoded.join("&");
}

/**
 * Does a GET for the JSON response at the given url. If successful,
 * returns the .result value from the returned JSON.
 *
 * @param {!string} url the url to fetch
 * @param {?Object.<string, number|string>} opt_params the GET params for the request
 *
 * @returns {goog.async.Deferred} of the response JSON.result
 */
delphi.util.getJson = function getJson(url, opt_params) {
  if (opt_params !== undefined) {
    url += "?" + formEncode(opt_params);
  }

  var result = new goog.async.Deferred();
  net_manager.send(net_id_counter++, url, "GET", undefined, undefined, undefined, xhrCallbackIntoDeferred(url, result));
  return result;
}

/**
 * Does a POST to the given url and retrieves the response JSON.
 * Returns the .result value from the response if successful.
 *
 * @param {!string} url url to fetch
 * @param {?Object.<string, number|string>} data the POST data to be encoded and sent with the request
 *
 * @returns {goog.async.Deferred} of the response JSON.result
 */
delphi.util.postJson =function postJson(url, data) {
  var encoded = formEncode(data);

  var result = new goog.async.Deferred();
  net_manager.send(net_id_counter++, url, "POST", encoded, undefined, undefined, xhrCallbackIntoDeferred(url, result));
  return result;
}

function xhrCallbackIntoDeferred(url, deferred) {
  return function(event) {
    if (event.type === "complete") {
      deferred.callback(event.target.getResponseJson().result);
    } else {
      event.url = url;
      deferred.errback(event);
    }
  };
}

/**
 * @param {!goog.async.Deferred} deferred
 * @param {function(*)} transform
 *
 * @returns {goog.async.Deferred}
 */
delphi.util.transformDeferred =function transformDeferred(deferred, transform) {
  var result = new goog.async.Deferred();
  deferred.addErrback(function(var_args) {
    result.errback.apply(result, arguments);
  });
  deferred.addCallback(function(arg) {
    result.callback.call(result, transform(arg));
  });
  return result;
}

