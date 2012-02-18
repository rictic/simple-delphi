import webapp2
import refinery
import raja
import json

from google.appengine.api import users

def json_responder(wrapped):
  def wrapper(self, *args, **kwargs):
    result = wrapped(self, *args, **kwargs)
    self.response.headers["Content-Type"] = "application/json"
    json.dump({"result": result}, self.response.out, indent=2)
  return wrapper

class Base(webapp2.RequestHandler):
  pass

class GetGroups(Base):
  @json_responder
  def get(self):
    return refinery.get_groups(users.get_current_user())

class GetQuestion(Base):
  @json_responder
  def get(self):
    user = users.get_current_user()
    session_id = self.request.params["session_id"]
    num = self.request.params.get("num")
    return raja.get_question(user.email(), session_id, num)

class SessionStatus(Base):
  @json_responder
  def post(self):
    session_id = self.request.params["session_id"]
    return raja.session_status(session_id)

class StartSession(Base):
  @json_responder
  def get(self):
    user = users.get_current_user()
    operator_id = user.email()
    group = self.request.params["group"]
    return raja.start_session(operator_id, [group])

class SubmitJudgment(Base):
  @json_responder
  def post(self):
    user = users.get_current_user()


# u.ensure_POST();

# u.execute(function(user) {
#   var operator_id = user.email;
#   var session_id = u.get_param("session_id","Must specify the 'session_id' parameter and it must be non-empty");
#   var question_id = u.get_param("question_id","Must specify the 'question_id' parameter and it must be non-empty");
#   var judgment = u.parse(u.get_param("judgment", "Must specify the 'judgment' parameter and it must be non-empty"));
#   var timecost = u.get_param("timecost", "Must specify the 'timecost' parameter and it must be non-empty");
#   u.send_response(acre.require("scripts/raja.sjs").submit_judgment(operator_id,session_id,question_id,judgment,timecost));
# });




class Signout(Base):
  def get(self):
    self.response.status = 301
    self.response.headers["Location"] = users.create_logout_url("/")



app = webapp2.WSGIApplication([
    ("/apis/get_groups", GetGroups),
    ("/apis/get_question", GetQuestion),
    ("/apis/session_status", SessionStatus),
    ("/apis/start_session", StartSession),
    ("/apis/submit_judgment", SubmitJudgment),
    ("/apis/signout", Signout),
    ], debug=True)
