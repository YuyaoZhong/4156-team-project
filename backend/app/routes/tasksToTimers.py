#!/user/bin/python3
# -*- coding: utf-8 -*-
""" Create relations between tasks and timers
"""

from flask import request, jsonify
from app.ext import db
from app.routes import routes
from app.models import Task, TaskToTimer, Timer
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysExist
from datetime import datetime
# @routes.route('/task_timers')
# def test():
#     # for test, to delete
#     print('test for task2timer')
#
#     task = Task(id=-200, taskListId=0, userId=0, name='test_task', status=0)
#     timer = Timer(id=-200, userId=0, title="test timer", description="this is a test timer", zoomLink="",
#                   startTime=datetime.now().isoformat(), duration=25, breakTime=5, round=1)
#
#     db.session.add(task)
#     db.session.add(timer)
#     db.session.commit()
#     return "Success create"

@routes.route('/task_timers/<id>', methods=['GET', 'DELETE'])
def handleTaskTimer(id):
    """This function is used to handle GET / DELETE requests for handle task timer"""
    getCode, getMsg, targetTaskTimer = getTaskTimer(id)
    if targetTaskTimer:
        print(targetTaskTimer.toDict)
    result = {"code": getCode, "message": getMsg, "data": None}
    if request.method == "GET":
        if targetTaskTimer:
            result["data"] = targetTaskTimer.toDict()
    elif request.method == "DELETE":
        if not targetTaskTimer:
            return jsonify(result)
        try:
            db.session.delete(targetTaskTimer)
            db.session.commit()
            code, msg = 200, apiStatus.getResponseMsg(200)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)
        result["code"] = code
        result["message"] = msg
    return jsonify(result)

def getTaskTimer(id):
    try:
        targetTaskTimer = TaskToTimer.query.get(id)
    except:
        code, msg = 500, apiStatus.getResponseMsg(500)
        return code, msg, None
    # code, msg = 0, ""
    if not targetTaskTimer:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        code, msg = 200, apiStatus.getResponseMsg(200)

    return code, msg, targetTaskTimer



@routes.route('/task_timers/', methods=['POST'])
def createTaskTimer():
    data =  request.get_json()
    postAttrs = ['taskId', 'timerId', 'userId']
    code, msg, result = 0, "", {"data": None}
    if not judgeKeysExist(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        targetTask = Task.query.get(data['taskId'])  # query by primary key
        targetTimer = Task.query.get(data['timerId'])
        if not targetTask or not targetTimer:
            code, msg = 404, apiStatus.getResponseMsg(404)
        elif str(data['userId']) != str(targetTask.userId) or str(data['userId']) != str(targetTimer.userId):
            code, msg = 401, apiStatus.getResponseMsg(401)
        else:
            try:
                newTaskToTimer = TaskToTimer(taskId=str(targetTask.id), timerId=str(targetTimer.id))
                db.session.add(newTaskToTimer)
                db.session.commit()
                result["data"] = newTaskToTimer.toDict()
                code, msg = 201, apiStatus.getResponseMsg(201)
            except:
                # add repeat relations may cause internal error
                code, msg = 500, apiStatus.getResponseMsg(500)


    result["code"] = code
    result["message"] = msg
    # print(result)
    return jsonify(result)

