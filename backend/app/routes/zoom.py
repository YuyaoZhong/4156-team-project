"""Create and manage tasks"""

from flask import request, json, jsonify
from app.routes import routes
from app.ext import db
from app.models import Timer
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysCorrect
import requests
import os
from base64 import b64encode

ZOOM_CREDENTIALS = os.environ.get('ZOOM_APP_CREDENTIALS')

@routes.route('/zoom/', methods=['GET'])
def zoomIntegreation():
    code = request.args.get('code')
    print("code: ", code)
    params = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "https://127.0.0.1:5050/zoom"
    }
    headers = {
        "Authorization": "Basic " + b64encode(ZOOM_CREDENTIALS.encode('utf-8')).decode('utf-8')
    }
    print(headers)
    r = requests.post('https://zoom.us/oauth/token', params=params, headers=headers)
    print(r.text)

    response = json.loads(r.text)

    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + response["access_token"]
    }

    data = {
        "topic": "Test",
        "type": 2,
        "start_time": "2020-11-21T19:00:00",
        "timezone": "America/New_York"
    }
    print(jsonify(data))
    r = requests.post('https://api.zoom.us/v2/users/me/meetings', headers=headers, data=json.dumps(data))
    response = json.loads(r.text)

    data = {
        "start_url: ": response['start_url'],
        "join_url: ": response['join_url']
    }

    code, msg, result = 200, apiStatus.getResponseMsg(200), {'data': data}

    result["code"] = code
    result["message"] = msg
    return jsonify(result)