"""
RestFUL API for task list
"""
from flask import (
    request, jsonify
)
from app.ext import db
from app.routes import routes
from app.models import TaskList
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysCorrect


@routes.route('/tasklists/<taskListId>', methods=['GET'])
def getTaskList(taskListId):
    """API for getting all tasklists with task list id as taskListId"""
    code, msg, result = 0, '', {'data': None}
    targetTaskList = TaskList.query.get(taskListId)
    if not targetTaskList:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        result['data'] = targetTaskList.toDict()
        code, msg = 200, apiStatus.getResponseMsg(200)
    result["code"] = code
    result["message"] = msg

    return jsonify(result)


"""

"""
@routes.route('/tasklists/<taskListId>', methods=['DELETE'])
def deleteTaskList(taskListId):
    """API for delete a task list with id"""
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
    """API for updating a task list with id as taskListId from request body"""
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
    """API for creating a new task list from request body"""
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

@routes.route('/tasklists', methods=['GET'])
# def getTaskLists():
#     """This function is for the server to get timers from the database"""
#     code, msg, result = 0, "", {"data": None}
#     taskListId = request.args.get('taskListId', None)
#     userId = request.args.get('userId', None)
#     if taskListId is not None :
#         targetTask= TaskList.query.get(taskListId)  # query by primary key
#         if not targetTask:
#             code, msg = 404, apiStatus.getResponseMsg(404)
#         else:
#             result["data"] = targetTask.toDict()
#             code, msg = 200, apiStatus.getResponseMsg(200)
#         result["code"] = code
#         result["message"] = msg
#         return jsonify(result)
#     if userId is not None:
#         result["data"] = []
#         targetTaskList = TaskList.query.filter_by(userId=userId).all()
#         if not targetTaskList:
#             code, msg = 404, apiStatus.getResponseMsg(404)
#         else:
#             for task in targetTaskList :
#                 result['data'].append(task.toDict())
#             code, msg = 200, apiStatus.getResponseMsg(200)
#         result["code"] = code
#         result["message"] = msg
#         return jsonify(result)
#     code, msg = 400, apiStatus.getResponseMsg(400)
#     result["code"] = code
#     result["message"] = msg
#
#     return jsonify(result)
def getTaskListsByUserId():
    """API for getting all tasklists with user id as userId"""
    userId = request.args.get('userId', None)
    code, msg, result = 0, '', {"data": None}
    taskLists = TaskList.query.filter_by(userId=userId).all()
    result["data"] = []
    if not taskLists:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        for taskList in taskLists:
            result["data"].append(taskList.toDict())
        code, msg = 200, apiStatus.getResponseMsg(200)

    result["code"] = code
    result["message"] = msg
    return jsonify(result)


# For debug usage
@routes.route('/tasklists/debug', methods = ['GET'])
def getAll():
    """API for debug usage: Get ALL task lists currently in the database"""
    code, msg, result = 0, '', {'data': None}
    taskLists = TaskList.query.all()
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


@routes.route('/tasklists/debug', methods = ['DELETE'])
def deleteAll():
    """API for debug usage: DELETE ALL task lists currently in the database"""
    code, msg, result = 0, '', {'data': None}
    taskLists = TaskList.query.all()
    if not taskLists:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        result['data'] = []
        for taskList in taskLists:
            taskListId = taskList.id
            targetTaskList = TaskList.query.get(taskListId)
            try:
                db.session.delete(targetTaskList)
                db.session.commit()
                code, msg = 201, apiStatus.getResponseMsg(201)
            except :
                code, msg = 500, apiStatus.getResponseMsg(500)

    result['code'] = code
    result['message'] = msg
    return jsonify(result)
