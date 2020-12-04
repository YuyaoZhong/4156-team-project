#!/user/bin/python3
# -*- coding: utf-8 -*-
""" Create relations between tasks and timers
"""

from flask import request, jsonify
from app.ext import db
from app.routes import routes
from app.models import Task, TaskToTimer, Timer
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysExist, judgeInputValid, judgeIntValid


@routes.route('/task_timers/<taskTimerId>', methods=['GET', 'DELETE'])
def handleTaskTimer(taskTimerId):
    """This function is used to handle GET / DELETE requests for handle task timer"""

    if not judgeIntValid(taskTimerId):
        code, msg = 400, apiStatus.getResponseMsg(400)
        return jsonify({"code": code, "message": msg, "data": None})

    getCode, getMsg, targetTaskTimer = getTaskTimer(int(taskTimerId))
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

def getTaskTimer(taskTimerId):
    """This function is used to handle retrieve task from database"""
    if not judgeIntValid(taskTimerId):
        code, msg = 400, apiStatus.getResponseMsg(400)
        return jsonify({"code": code, "message": msg, "data": None})

    try:
        targetTaskTimer = TaskToTimer.query.get(taskTimerId)
    except:
        return 500, apiStatus.getResponseMsg(500), None
    if not targetTaskTimer:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        code, msg = 200, apiStatus.getResponseMsg(200)

    return code, msg, targetTaskTimer

@routes.route('/task_timers', methods = ['GET'])
def handleQueryTasksOrTimers():
    """handle request to retrieve lists of tasks or timers"""
    taskId = request.args.get('taskId', None)
    timerId = request.args.get('timerId', None)
    userId = request.args.get('userId', None) # for verification

    # judge input
    inputData = {"taskId": taskId, "timerId": timerId, "userId": userId}
    if not judgeInputValid(inputData):
        code, msg = 400, apiStatus.getResponseMsg(400)
        return jsonify({"code": code, "message": msg, "data": None})

    if (taskId and timerId) or not userId:
        code, msg = 500, apiStatus.getResponseMsg(500)
        return jsonify({"code": code, "message": msg, "data":[]})

    code, msg, resultData = 0, "", []
    result = {}
    if not timerId and not taskId and userId:
        # retrieve by user
        result['data'] = []  # should also return an empty list
        targetRels = TaskToTimer.query.filter_by(userId=userId).all()
        if not targetRels:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            for rel in targetRels:
                result['data'].append(rel.toDict())
            code, msg = 200, apiStatus.getResponseMsg(200)

    elif timerId:
        targetTimer = Timer.query.get(timerId)
        if not targetTimer:
            code, msg = 404, apiStatus.getResponseMsg(404)
        # elif targetTimer.userId != userId:
        #     code, msg = 401, apiStatus.getResponseMsg(401)
        else:
            code, msg, resultData = getTasksByTimerid(int(timerId))
    elif taskId:
        targetTask = Task.query.get(taskId)
        if not targetTask:
            code, msg = 404, apiStatus.getResponseMsg(404)
        elif targetTask.userId !=userId:
            code, msg = 401, apiStatus.getResponseMsg(401)
        else:
            code, msg, resultData = getTimersByTaskid(int(taskId))

    result["code"] = code
    result["message"] = msg
    result["data"] = resultData
    return jsonify(result)

def getTasksByTimerid(timerId):
    """get lists of tasks by timer id"""
    if not judgeIntValid(timerId):
        code, msg = 400, apiStatus.getResponseMsg(400)
        return jsonify({"code": code, "message": msg, "data": None})

    try:
        # disable no member since it is setted flask function
        # may think about change to join query
        relateTasks = TaskToTimer.query.filter_by(timerId = timerId).all()
        relateTaskDict = {}
        for relTask in relateTasks:
            relateTaskDict[relTask.taskId] = relTask.id
        relatedTasksId = [rel.taskId for rel in relateTasks]
        tasks = Task.query.filter(Task.id.in_(relatedTasksId)).all()
        tasksData =[]
        for task in tasks:
            taskDict = task.toDict()
            taskDict["relId"] = relateTaskDict[task.id]
            tasksData.append(taskDict)
        # relatedTasks = db.session.query(TaskToTimer.taskId.label('taskId')).filter( # pylint: disable=maybe-no-member
        #     TaskToTimer.timerId == timerId).subquery() # pylint: disable=maybe-no-member
        # tasks = db.session.query(Task).filter(Task.id.in_(relatedTasks)).all() # pylint: disable=maybe-no-member
        # tasksData = [task.toDict() for task in tasks]
        code, msg = 200, apiStatus.getResponseMsg(200)
    except:
        return 500, apiStatus.getResponseMsg(500), []
    return code, msg, tasksData

# def getDataByUserId(userId):

def getTimersByTaskid(taskId):
    """get lists of timers by task id"""
    if not judgeIntValid(taskId):
        code, msg = 400, apiStatus.getResponseMsg(400)
        return jsonify({"code": code, "message": msg, "data": None})

    try:
        relatedTasks = db.session.query(TaskToTimer.timerId.label('timerId')).filter( # pylint: disable=maybe-no-member
            TaskToTimer.taskId == taskId).subquery() # pylint: disable=maybe-no-member
        timers = db.session.query(Timer).filter(Timer.id.in_(relatedTasks)).all() # pylint: disable=maybe-no-member
        timersData = [timer.toDict() for timer in timers]
        code, msg = 200, apiStatus.getResponseMsg(200)
    except:
        return 500, apiStatus.getResponseMsg(500), []
    return code, msg, timersData


@routes.route('/task_timers/', methods=['POST'])
def createTaskTimer():
    """This function is used to create a new relation"""
    data =  request.get_json()

    if not judgeInputValid(data):
        print(data)
        code, msg = 400, apiStatus.getResponseMsg(400)
        return jsonify({"code": code, "message": msg, "data": None})

    postAttrs = ['taskId', 'timerId', 'userId']
    code, msg, result = 0, "", {"data": None}
    if not judgeKeysExist(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        targetTask = Task.query.get(data['taskId'])  # query by primary key
        targetTimer = Timer.query.get(data['timerId'])
        specifiedId = data['id'] if 'id' in data else None
        if not targetTask or not targetTimer:
            code, msg = 404, apiStatus.getResponseMsg(404)
        # elif str(data['userId']) != str(targetTask.userId) \
        #         or str(data['userId']) != str(targetTimer.userId):
        #     code, msg = 401, apiStatus.getResponseMsg(401)
        else:
            try:
                newTaskToTimer = TaskToTimer(taskId=str(targetTask.id), timerId=str(targetTimer.id), userId=str(data['userId']))
                if specifiedId:
                    newTaskToTimer.update({"id": specifiedId})
                db.session.add(newTaskToTimer)
                db.session.commit()
                result["data"] = newTaskToTimer.toDict()
                code, msg = 201, apiStatus.getResponseMsg(201)
            except:
                # add repeat relations may cause internal error
                code, msg = 500, apiStatus.getResponseMsg(500)


    result["code"] = code
    result["message"] = msg
    return jsonify(result)
