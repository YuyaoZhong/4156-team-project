"""Create and manage tasks"""

from flask import request, jsonify
from app.routes import routes
from app.ext import db
from app.models import Task
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysCorrect


#@routes.route('/tasks')
#def testTask():
#    return "tasks url"

@routes.route('/tasks', methods=['GET'])
def getTasks():
    """This function is for the server to get timers from the database"""
    code, msg, result = 0, "", {"data": None}
    taskId = request.args.get('taskId', None)
    userId = request.args.get('userId', None)
    if taskId is not None :
        targetTask= Task.query.get(taskId)  # query by primary key
        if not targetTask:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            result["data"] = targetTask.toDict()
            code, msg = 200, apiStatus.getResponseMsg(200)
        result["code"] = code
        result["message"] = msg
        return jsonify(result)
    if userId is not None:
        result['data'] = []
        targetTasks = Task.query.filter_by(userId=userId).all()
        if not targetTasks:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            for task in targetTasks :
                result['data'].append(task.toDict())
            code, msg = 200, apiStatus.getResponseMsg(200)
        result["code"] = code
        result["message"] = msg
        return jsonify(result)
    code, msg = 400, apiStatus.getResponseMsg(400)
    result["code"] = code
    result["message"] = msg

    return jsonify(result)

@routes.route('/tasks/<taskId>', methods=["GET"])
def getTask(taskId):
    """get task from the database"""
    code, msg, result = 0, '', {'data': None}
    targetTask = Task.query.get(taskId)
    if not targetTask:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        result["data"] = targetTask.toDict()
        code, msg = 200, apiStatus.getResponseMsg(200)
    result["code"] = code
    result["message"] = msg
    return jsonify(result)

@routes.route('/tasks/<taskId>', methods=['DELETE'])
def deleteTask(taskId):
    """delete task from database"""
    code, msg, result = 0, '', {'data': None}
    targetTask = Task.query.get(taskId)
    if not targetTask:
        code, msg = 404, apiStatus.getResponseMsg(404)
    else:
        try:
            db.session.delete(targetTask)
            db.session.commit()
            code, msg = 201, apiStatus.getResponseMsg(201)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)
    result["code"] = code
    result['message'] = msg

    return jsonify(result)

@routes.route('/tasks', methods=['POST'])
def createTasks():
    """create a task and save to database"""
    data = request.get_json()
    postAttrs = ['userId', 'taskListId', 'name', 'status' ]
    code, msg, result = 0, '', {'data': None}
    if not data:
        code, msg = 400, apiStatus.getResponseMsg(400)
    elif not judgeKeysCorrect(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        try:
            userId = data['userId']
            taskListId = data['taskListId'] if 'taskListId' in data else -1
            name = data['name']
            status = data['status']
            newTask = Task(userId=userId, taskListId=taskListId, name=name, status=status)
            db.session.add(newTask)
            db.session.commit()
            result['data'] = newTask.toDict()
            code, msg = 201, apiStatus.getResponseMsg(201)
        except:
            code, msg = 500, apiStatus.getResponseMsg(500)
    result['code'] = code
    result['message'] = msg
    return jsonify(result)


@routes.route('/tasks/<taskId>', methods=['PUT'])
def putTask(taskId):
    """edit attributes of a task"""
    data = request.get_json()
    postAttrs = ['userId', 'taskListId', 'name', 'status' ]
    code, msg, result = 0, "", {'data': None}
    if not data:
        code, msg = 400, apiStatus.getResponseMsg(400)
    elif not judgeKeysCorrect(data, postAttrs):
        code, msg = 400, apiStatus.getResponseMsg(400)
    else:
        targetTask = Task.query.get(taskId)
        if not targetTask:
            code, msg = 404, apiStatus.getResponseMsg(404)
        else:
            try:
                targetTask.update(data)
                db.session.commit()
                result['data'] = targetTask.toDict()
                code, msg = 201, apiStatus.getResponseMsg(201)
            except:
                code, msg = 500, apiStatus.getResponseMsg(500)
    result['code'] = code
    result['message'] = msg
    return jsonify(result)
