import util
import json
import time

# FIXME(stefanom): make sure this gets implemented properly later
auth_token = "1"

raja = util.Requester("http://raja-portico.appspot.com")


def start_session(operator_id, groups):
  params = {
    "operator_id": operator_id,
    "auth_token": auth_token,
    "tasks": json.dumps(groups)
  }

  return raja.get("/sessions/start", params)


def get_question(operator_id, session_id, num):
  params = {
    "operator_id": operator_id,
    "session_id": session_id
  }
  if num:
    params["num"] = num

  return raja.get("/questions/serve", params)


def submit_judgment(operator_id, session_id, question_id, judgment, timecost):
  timestamp = int(round(time.time()))
  params = {
    "operator_id": operator_id,
    "session_id": session_id,
    "question_id": question_id,
    "time_cost_ms": timecost,
    "timestamp": timestamp,
    "answer": judgment
  };
  return raja.post("/questions/" + question_id + "/answer", params)


def session_status(session_id):
  return raja.postJSON("/sessionstatus", {"session_id": session_id})