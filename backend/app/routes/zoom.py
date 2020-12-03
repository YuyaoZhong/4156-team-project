
from flask import request, json, jsonify
from app.routes import routes
from app.ext import db
from app.models import Timer
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysCorrect
import requests
import os
from base64 import b64encode

ZOOM_CREDENTIALS = os.environ.get("ZOOM_APP_CREDENTIALS")

@routes.route("/zoom", methods=["PUT"])
def zoomIntegration():
    code = request.args.get("code")
    timerId = request.args.get("state")
    print("code: ", code)
    print("state: ", timerId)
    params = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://localhost:3000/zoom"
    }
    headers = {
        "Authorization": "Basic" + " " + b64encode(ZOOM_CREDENTIALS.encode("utf-8")).decode("utf-8")
    }
    print(headers)
    r = requests.post("https://zoom.us/oauth/token", params=params, headers=headers)
    print(r.text)

    if r.status_code != 200 and r.status_code != 201:
        code, msg, result = r.status_code, apiStatus.getResponseMsg(code), {"data": json.loads(r.text)}

        result["code"] = code
        result["message"] = msg
        return jsonify(result)

    response = json.loads(r.text)

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + response["access_token"]
    }

    data = {
        "topic": "Test",
        "type": 2,
        "start_time": "2020-11-21T19:00:00"
    }
    print(jsonify(data))

    targetTimer = Timer.query.get(timerId)
    if not targetTimer:
        code, msg, result = 404, apiStatus.getResponseMsg(404), {"data": None}

        result["code"] = code
        result["message"] = msg
        return jsonify(result)

    else:
        timer = targetTimer.toDict()
        data["topic"] = timer["title"]
        data["start_time"] = timer["startTime"]

    r = requests.post("https://api.zoom.us/v2/users/me/meetings", headers=headers, data=json.dumps(data))

    # Not testable, I don't think fail a meeting creation is possible normally
    # unless reaching the daily meeting creation limit

    if r.status_code != 200 and r.status_code != 201:
        code, msg, result = r.status_code, apiStatus.getResponseMsg(code), {"data": json.loads(r.text)}

        result["code"] = code
        result["message"] = msg
        return jsonify(result)

    response = json.loads(r.text)

    timer["zoomLink"] = response["join_url"] 
    targetTimer = Timer.query.get(timerId)
    try:
        targetTimer.update(timer)
        db.session.commit()
    except:
        code, msg, result = 500, apiStatus.getResponseMsg(500), {"data": None}
        result["code"] = code
        result["message"] = msg
        return jsonify(result)

    data = {
        "start_url": response["start_url"],
        "join_url": response["join_url"]
    }

    code, msg, result = 200, apiStatus.getResponseMsg(200), {"data": data}

    result["code"] = code
    result["message"] = msg
    return jsonify(result)