import webapp2
import util

js_files = [
    "client/jquery.js",
    "client/json2.js",
    "client/postmessage.js",
    "client/delphi.js"
]
class ConcatJs(webapp2.RequestHandler):
  def get(self):
    #TODO(rictic): caching when not in dev mode
    self.response.headers["Content-Type"] = "application/javascript"
    resp = []
    for fname in js_files:
        resp.append(open(fname).read())
    self.response.out.write("(function(){\n%s\n})()" % "\n".join(resp))



app = webapp2.WSGIApplication([
    ("/client/delphi.js", ConcatJs),
    ], debug=util.in_development)
