from app.ext import db
from app.routes import routes
from app.models import TaskList
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysCorrect
from flask import (
    request, jsonify
)


@routes.route('/tasklists/<taskListId>', methods=['GET'])
def getTaskList(taskListId):
    code, msg, result = 0, '', {'data': None}
    targetTaskList = TaskList.query.get(taskListId)
    if not targetTaskList:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        result["data"] = targetTaskList.toDict()
        code, msg = 200, apiStatus.getResponseMsg(200)
    result["code"] = code
    result["message"] = msg

    return jsonify(result)


@routes.route('/tasklists/<taskListId>', methods=['DELETE'])
def deleteTaskList(taskListId):
    code, msg, result = 0, '', {'data': None}
    targetTaskList = TaskList.query.get(taskListId)
    if not targetTaskList:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        try:
            db.session.delete(targetTaskList)
            db.session.commit()
            code, msg = 201, apiStatus.getResponseMsg(201)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)

    result['code'] = code
    result['message'] = msg
    return jsonify(result)


@routes.route('/tasklists/<taskListId>', methods=['PUT'])
def putTaskList(taskListId):
    data = request.get_json(force=True)
    postAttrs = ['userId', 'name']
    code, msg, result = 0, '', {'data': None}
    if not data:
        code, msg = 400, apiStatus.getResponseMsg(400)
    elif not judgeKeysCorrect(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        targetTaskList = TaskList.query.get(taskListId)
        if not targetTaskList:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            try:
                targetTaskList.update(data)
                db.session.commit()
                result['data'] = targetTaskList.toDict()
                code, msg = 201, apiStatus.getResponseMsg(201)
            except:
                code, msg = 500, apiStatus.getResponseMsg(500)
    result['code'] = code
    result['message'] = msg
    return jsonify(result)


@routes.route('/tasklists', methods=['POST'])
def createTaskList():
    data = request.get_json(force=True)
    postAttrs = ['userId', 'name']
    code, msg, result = 0, '', {'data': None}
    if not data:
        code, msg = 400, apiStatus.getResponseMsg(400)
    elif not judgeKeysCorrect(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        try:
            userId = data['userId']
            name = data['name']
            newTaskList = TaskList(userId=userId, name=name)
            db.session.add(newTaskList)
            db.session.commit()
            result['data'] = newTaskList.toDict()
            code, msg = 201, apiStatus.getResponseMsg(201)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)

    result['code'] = code
    result['message'] = msg
    return jsonify(result)


@routes.route('/tasklists/user/<userId>', methods=['GET'])
def getTaskListsByUserId(userId):
    code, msg, result = 0, '', {'data': None}
    taskLists = TaskList.query.filter_by(userId=userId).all()
    if not taskLists:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        result['data'] = []
        for taskList in taskLists:
            result['data'].append(taskList.toDict())
        code, msg = 200, apiStatus.getResponseMsg(200)

    result['code'] = code
    result['message'] = msg
    return jsonify(result)
