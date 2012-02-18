import webapp2
import refinery
import raja
import json
import util
import logging

from google.appengine.api import users

def json_responder(wrapped):
  def wrapper(self, *args, **kwargs):
    #TODO(rictic): HTTP error handling
    result = wrapped(self, *args, **kwargs)
    self.response.headers["Content-Type"] = "application/json"
    json.dump({"result": result}, self.response.out, indent=2)
  return wrapper


class Base(webapp2.RequestHandler):
  def require_params(self, params):
    values = []
    for param in params:
      if param not in self.request.params:
        raise UserError("You must provide the param '%s'" % param)
      values.append(self.request.params[param])
    return values


class GetGroups(Base):
  @json_responder
  def get(self):
    return refinery.get_groups(users.get_current_user())


class GetQuestion(Base):
  @json_responder
  def get(self):
    user = users.get_current_user()
    session_id, = self.require_params(["session_id"])
    num = self.request.params.get("num")
    return raja.get_question(user.email(), session_id, num)


class SessionStatus(Base):
  @json_responder
  def post(self):
    session_id, = self.require_params(["session_id"])
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
    logging.error("%r" % self.request.body)
    user = users.get_current_user()
    operator_id = user.email()
    session_id, question_id, judgment, timecost = self.require_params(
        ["session_id", "question_id", "judgment", "timecost"])
    return raja.submit_judgment(operator_id, session_id, question_id,
        judgment, timecost)


class Signout(Base):
  def get(self):
    self.response.status = 301
    self.response.headers["Location"] = users.create_logout_url("/")

class RedirectToIndex(Base):
  def get(self):
    self.response.status = 301
    self.response.headers["Location"] = "/index.html"

class Echo(Base):
  @json_responder
  def post(self):
    return dict(self.request.params.items())

  @json_responder
  def get(self):
    return dict(self.request.params.items())



app = webapp2.WSGIApplication([
    ("/apis/get_groups", GetGroups),
    ("/apis/get_question", GetQuestion),
    ("/apis/session_status", SessionStatus),
    ("/apis/start_session", StartSession),
    ("/apis/submit_judgment", SubmitJudgment),
    ("/apis/signout", Signout),
    ("/apis/echo", Echo),
    ("/", RedirectToIndex)
    ], debug=util.in_development)