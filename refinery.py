import util

# FIXME(stefanom): make sure this gets implemented properly later
auth_token = "1"


refinery = util.Requester("http://sandbox.freebase-refinery.appspot.com")
#var refinery = util.Requester("http://refinery.freebase.com")

def get_groups(user):
  params = {
    "user_id": user.user_id(),
    "email": user.email()
  }
  return refinery.get("/get_contributor_tasks", params)["tasks"]

