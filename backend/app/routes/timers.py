#!/user/bin/python3
# -*- coding: utf-8 -*-
""" Create Api for Timer
"""

import datetime
from flask import request, jsonify
from app.ext import db
from app.routes import routes
from app.models import Timer
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysExist
from app.utls.utilities import judgeKeysCorrect




@routes.route('/timers')
def testTimers():
    """this is for test"""
    return "timers url"


@routes.route('/timers/', methods=['GET'])
def getTimers():
    """This function is for the server to get timers from the database"""
    code, msg, result = 0, "", {"data": None}
    timerId = request.args.get('timerId', None)
    userId = request.args.get('userId', None)
    if timerId is not None :
        targetTimer = Timer.query.get(timerId)  # query by primary key
        if not targetTimer:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            result["data"] = targetTimer.toDict()
            code, msg = 200, apiStatus.getResponseMsg(200)
        result["code"] = code
        result["message"] = msg
        return jsonify(result)
    if userId is not None:
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

    code, msg = 400, apiStatus.getResponseMsg(400)
    result["code"] = code
    result["message"] = msg
    return jsonify(result)


@routes.route('/timers/<timerId>', methods=['DELETE'])
def deleteTimers(timerId):
    """This function is for the server to delete timers"""
    code, msg, result = 0, "", {"data": None}
    targetTimer = Timer.query.get(timerId)  # query by primary key
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
    """This function is for the server to create new timers"""
    data =  request.get_json()
    postAttrs = ['userId', 'title', 'startTime', 'duration', 'breakTime', 'round']
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
                sTime = datetime.datetime.strptime(startTime, "%Y-%m-%d %H:%M:%S")
                newDuration = (duration + breakTime) * round
                newDuration = datetime.timedelta(minutes=newDuration)
                eTime = sTime + newDuration
                if oldTimer.startTime <= sTime < endTime or oldTimer.startTime < eTime <= endTime:
                    code, msg = 403, apiStatus.getResponseMsg(403)
                    result["code"] = code
                    result["message"] = msg
                    return jsonify(result)
                if sTime < oldTimer.startTime and eTime > endTime:
                    code, msg = 403, apiStatus.getResponseMsg(403)
                    result["code"] = code
                    result["message"] = msg
                    return jsonify(result)
        try:
            newTimer = Timer(userId=str(userId), title=str(title),
                             description=str(description), zoomLink=str(zoomLink),
                             startTime=str(startTime), duration=str(duration),
                             breakTime=str(breakTime), round=str(round))
            db.session.add(newTimer)
            db.session.commit()
            result["data"] = newTimer.toDict()
            code, msg = 201, apiStatus.getResponseMsg(201)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)
    result["code"] = code
    result["message"] = msg
    return jsonify(result)


@routes.route('/timers/<timerId>', methods=['PUT'])
def putTimers(timerId):
    """This function is for the server to update timers"""
    data =  request.get_json()
    postAttrs = ['userId', 'title', 'startTime', 'duration',
                 'breakTime', 'round', 'description', 'zoomLink']
    code, msg, result = 0, "", {"data": None}
    if not judgeKeysCorrect(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        targetTimer = Timer.query.get(timerId)
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
