import urllib
import urllib2
import json
import logging
import os

class Requester(object):
  def __init__(self, base_url):
    self.base_url = base_url

  def get(self, path, params):
    url = self.base_url + path + "?" + urllib.urlencode(params)
    logging.info("GETing JSON from URL: %s", url)
    request = urllib2.Request(url,
                              headers={"Content-Type": "application/json"})
    return json.load(urllib2.urlopen(request, timeout=30)).get("result")

  def post(self, path, params):
    url = self.base_url + path
    encoded_data = urllib.urlencode(params)
    logging.info("POSTing form-encoded data to URL: %s", url)
    logging.info("With data:\n%s", encoded_data)
    request = urllib2.Request(
        url,
        data=encoded_data)
    return json.load(urllib2.urlopen(request, timeout=30)).get("result")

  def postJSON(self, path, data):
    url = self.base_url + path
    logging.info("POSTing json-encoded data to URL: %s", url)
    request = urllib2.Request(
        url,
        data=json.dumps(data),
        headers={"Content-Type": "application/json"})
    return json.load(urllib2.urlopen(request, timeout=30))

in_development = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')
