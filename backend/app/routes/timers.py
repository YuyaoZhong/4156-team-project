from flask import request, jsonify
from app.ext import db
from app.routes import routes
from app.models import Task, TaskToTimer, Timer
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysExist
from app.utls.utilities import judgeKeysCorrect




@routes.route('/timers')
def testTimers():
    return "timers url"


@routes.route('/timers/<id>', methods=['GET'])
def getTimers(id):
    code, msg, result = 0, "", {"data": None}
    targetTimer = Timer.query.get(id)  # query by primary key
    if not targetTimer:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        result["data"] = targetTimer.toDict()
        code, msg = 200, apiStatus.getResponseMsg(200)
    result["code"] = code
    result["message"] = msg

    return jsonify(result)

@routes.route('/timers/<id>', methods=['DELETE'])
def deleteTimers(id):
    code, msg, result = 0, "", {"data": None}
    targetTimer = Timer.query.get(id)  # query by primary key
    if not targetTimer:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        try:
            db.session.delete(targetTimer)
            db.session.commit()
            code, msg = 200, apiStatus.getResponseMsg(200)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)
    result["code"] = code
    result["message"] = msg

    return jsonify(result)

@routes.route('/timers', methods=['POST'])
def createTimers():
    data =  request.get_json()
    postAttrs = ['userId', 'title', 'startTime', 'duration', 'breakTime', 'round']
    # optionalAttrs = ['description', 'zoomLink', 'duration', 'breakTime', 'round']
    code, msg, result = 0, "", {"data": None}
    if not judgeKeysExist(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        try:
            userId = data['userId']
            title = data['title']
            description = data['description'] if 'description' in data else None
            zoomLink = data['zoomLink'] if 'zoomLink' in data else None
            startTime = data['startTime']
            duration = data['duration']
            breakTime = data['breakTime']
            round = data['round']
            newTimer = Timer(userId=str(userId), title=str(title), description=str(description), zoomLink=str(zoomLink), startTime=str(startTime),
                             duration=str(duration), breakTime=str(breakTime), round=str(round))
            db.session.add(newTimer)
            db.session.commit()
            result["data"] = newTimer.toDict()
            code, msg = 201, apiStatus.getResponseMsg(201)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)
    result["code"] = code
    result["message"] = msg
    return jsonify(result)


@routes.route('/timers/<id>', methods=['PUT'])
def putTimers(id):
    data =  request.get_json()
    postAttrs = ['userId', 'title', 'startTime', 'duration', 'breakTime', 'round', 'description', 'zoomLink']
    code, msg, result = 0, "", {"data": None}
    if not data:
        code, msg = 400, apiStatus.getResponseMsg(400)
    elif not judgeKeysCorrect(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        targetTimer = Timer.query.get(id)
        if not targetTimer:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            try:
                targetTimer.update(data)
                db.session.commit()
                result["data"] = targetTimer.toDict()
                code, msg = 200, apiStatus.getResponseMsg(201)
            except:
                code, msg = 500, apiStatus.getResponseMsg(500)
    result["code"] = code
    result["message"] = msg
    return jsonify(result)
