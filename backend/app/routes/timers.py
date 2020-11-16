from flask import request, jsonify
from app.ext import db
from app.routes import routes
from app.models import Timer
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysExist
from app.utls.utilities import judgeKeysCorrect
import datetime




@routes.route('/timers')
def testTimers():
    return "timers url"


@routes.route('/timers/', methods=['GET'])
def getTimers():
    code, msg, result = 0, "", {"data": None}
    id = request.args.get('id', None)
    userId = request.args.get('userId', None)
    if id is not None :
        targetTimer = Timer.query.get(id)  # query by primary key
        if not targetTimer:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            result["data"] = targetTimer.toDict()
            code, msg = 200, apiStatus.getResponseMsg(200)
        result["code"] = code
        result["message"] = msg
        return jsonify(result)
    elif userId is not None:
        targetTimer = Timer.query.filter_by(userId=userId).all()
        if not targetTimer:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            result['data'] = []
            for timer in targetTimer :
                result['data'].append(timer.toDict())
            code, msg = 200, apiStatus.getResponseMsg(200)
        result["code"] = code
        result["message"] = msg

        return jsonify(result)
    else:
        code, msg = 400, apiStatus.getResponseMsg(400)
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

@routes.route('/timers/', methods=['POST'])
def createTimers():
    data =  request.get_json()
    postAttrs = ['userId', 'title', 'startTime', 'duration', 'breakTime', 'round']
    # optionalAttrs = ['description', 'zoomLink', 'duration', 'breakTime', 'round']
    code, msg, result = 0, "", {"data": None}
    if not judgeKeysExist(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        userId = data['userId']
        title = data['title']
        description = data['description'] if 'description' in data else None
        zoomLink = data['zoomLink'] if 'zoomLink' in data else None
        startTime = data['startTime']
        duration = data['duration']
        breakTime = data['breakTime']
        round = data['round']
        oldTimers = Timer.query.filter_by(userId=userId).all()
        if oldTimers is not None:
            for oldTimer in oldTimers:
                totalDuration = (oldTimer.duration + oldTimer.breakTime) * oldTimer.round
                totalDuration = datetime.timedelta(minutes=totalDuration)
                endTime = oldTimer.startTime + totalDuration
                newStartTime = datetime.datetime.strptime(startTime, "%Y-%m-%d %H:%M:%S")
                newDuration = (duration + breakTime) * round
                newDuration = datetime.timedelta(minutes=newDuration)
                newEndTime = newStartTime + newDuration
                if oldTimer.startTime <= newStartTime < endTime or oldTimer.startTime < newEndTime <= endTime:
                    code, msg = 403, apiStatus.getResponseMsg(403)
                    result["code"] = code
                    result["message"] = msg
                    return jsonify(result)
                elif newStartTime < oldTimer.startTime and newEndTime > endTime:
                    code, msg = 403, apiStatus.getResponseMsg(403)
                    result["code"] = code
                    result["message"] = msg
                    return jsonify(result)
        try:
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
    if not judgeKeysCorrect(data, postAttrs):
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


# @routes.route('/timers/test', methods=['POST'])
# def tTimers():
#     data =  request.get_json()
#     postAttrs = ['userId', 'title', 'startTime', 'duration', 'breakTime', 'round']
#     code, msg, result = 0, "", {"data": None}
#     if not judgeKeysExist(data, postAttrs):
#         code, msg = 400, apiStatus.getResponseMsg(400)
#     else:
#         userId = data['userId']
#         oldTimers = Timer.query.filter_by(userId=userId).all()
#         for oldTimer in oldTimers:
#             print(oldTimer.startTime)
#             print(type(oldTimer.startTime))
#             totalDuration = (oldTimer.duration + oldTimer.breakTime)*oldTimer.round
#             totalDuration = datetime.timedelta(minutes=totalDuration)
#             endTime = oldTimer.startTime + totalDuration
#             startTime = data['startTime']
#             startTime = datetime.datetime.strptime(startTime, "%Y-%m-%d %H:%M:%S")
#             duration = data['duration']
#             breakTime = data['breakTime']
#             round = data['round']
#             newDuration = (duration + breakTime)*round
#             newDuration = datetime.timedelta(minutes=newDuration)
#             newEndTime = startTime + newDuration
#             print(startTime)
#             print(newEndTime)
#             if oldTimer.startTime <= startTime < endTime or oldTimer.startTime < newEndTime <= endTime:
#                 return "error1"
#             elif startTime < oldTimer.startTime and newEndTime > endTime:
#                 return "error2"
#
#             print(endTime)
#     return "test"
