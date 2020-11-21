#!/user/bin/python3
# -*- coding: utf-8 -*-
""" Create Api for Timer
"""

import datetime
from dateutil import parser
from flask import request, jsonify
from app.ext import db
from app.routes import routes
from app.models import TimerToUser
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysExist
from app.utls.utilities import judgeKeysCorrect

@routes.route('/timerToUser')
def testTimerToUser():
    """this is for test"""
    return "timerToUser url"

@routes.route('/timerToUser/', methods=['GET'])
def getTimerToUser():
    """This function is for the server to store the relationship about timers and users"""
    code, msg, result = 0, "", {"data": None}
    timerId = request.args.get('timerId', None)
    userId = request.args.get('userId', None)
    if userId is None and timerId is not None :
        target = TimerToUser.query.filter_by(timerId=timerId).all()
        if not target:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            result["data"] = []
            for timer in target:
                result['data'].append(timer.toDict())
            code, msg = 200, apiStatus.getResponseMsg(200)
        result["code"] = code
        result["message"] = msg
        return jsonify(result)
    if userId is not None and timerId is None:
        target = TimerToUser.query.filter_by(userId=userId).all()
        if not target:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            result['data'] = []
            for timer in target:
                result['data'].append(timer.toDict())
            code, msg = 200, apiStatus.getResponseMsg(200)
        result["code"] = code
        result["message"] = msg
        return jsonify(result)
    if userId is not None and timerId is not None:
        target = TimerToUser.query.filter_by(userId=userId, timerId=timerId).all()
        if not target:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            result['data'] = []
            for timer in target:
                result['data'].append(timer.toDict())
            code, msg = 200, apiStatus.getResponseMsg(200)
        result["code"] = code
        result["message"] = msg
        return jsonify(result)
    code, msg = 400, apiStatus.getResponseMsg(400)
    result["code"] = code
    result["message"] = msg

    return jsonify(result)

@routes.route('/timerToUser/<timerId>/<userId>', methods=['DELETE'])
def deleteTimerToUser(timerId,userId):
    """This function is for the server to delete timerToUser relations"""
    code, msg, result = 0, "", {"data": None}
    target = TimerToUser.query.filter_by(timerId=timerId, userId=userId).first()
    if not target:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        try:
            db.session.delete(target)
            db.session.commit()
            code, msg = 200, apiStatus.getResponseMsg(200)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)
    result["code"] = code
    result["message"] = msg

    return jsonify(result)

@routes.route('/timerToUser/', methods=['POST'])
def createTimerToUser():
    """This function is for the server to create new timerToUser relations"""
    data =  request.get_json()
    postAttrs = ['userId', 'timerId', 'status']
    code, msg, result = 0, "", {"data": None}
    if not judgeKeysExist(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        timerId = data['timerId']
        userId = data['userId']
        status = data['status']
        try:
            new = TimerToUser(timerId=timerId, userId=userId, status=status)
            db.session.add(new)
            db.session.commit()
            result["data"] = new.toDict()
            code, msg = 201, apiStatus.getResponseMsg(201)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)
    result["code"] = code
    result["message"] = msg
    return jsonify(result)

