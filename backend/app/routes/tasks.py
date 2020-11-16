from flask import request, jsonify
from app.routes import routes
from app.ext import db
from app.models import Task
from app.models import TaskList
from app.utls.apiStatus import apiStatus
from app.utls.utilities import judgeKeysCorrect


@routes.route('/tasks')
def testTask():
    return "tasks url"

@routes.route('/tasks/<taskId>', methods=["GET"])
def getTask(taskId):
    code, msg, result = 0, '', {'data': None}
    targetTask = Task.query.get(id)
    if not targetTask:
        code, msg = 404, apiStatus.getReponseMsg(404)
    else:
        result["data"] = targetTask.toDict()
        code, msg = 200, apiStatus.getReponseMsg(200)
    result["code"] = code
    result["message"] = msg
    
    return jsonify(result)

@routes.route('/tasks/<taskId>', methods=['DELETE'])
def deleteTask(taskId):
    code, msg, result = 0, '', {'data': None}
    targetTask = Task.query.get(taskId)
    if not targetTask:
        code, msg = 404, apiStatus.getReponseMsg(404)
    else:
        try:
            db.session.delete(targetTask)
            db.session.commit()
            code, msg = 200, apiStatus.getReponseMsg(200)
        except:
            code, msg = 500, apiStatus.getReponseMsg(500)
    result["code"] = code
    result['message'] = msg

    return jsonify(result)

@routes.route('/tasks', methods=['POST'])
def createTasks():
    data = request.get_json()
    postAttrs = ['userId', 'taskListId', 'name', 'status' ]
    code, msg, result = 0, '', {'data': None}
    if not data:
        code, msg = 400, apiStatus.getReponseMsg(400)
    elif not judgeKeysCorrect(data, postAttrs):
        code, msg = 400, apiStatus.getReponseMsg(400)
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
            code, msg = 201, apiStatus.getReponseMsg(201)
        except:
            code, msg = 500, apiStatus.getReponseMsg(500)
    result['code'] = code
    result['message'] = msg
    return jsonify(result)

@routes.route('/tasks/<taskId>', method=['PUT'])
def putTask(taskId):
    data = request.get_json()
    postAttrs = ['userId', 'taskListId', 'name', 'status' ]
    code, msg, result = 0, "", {'data': None}
    if not data:
        code, msg = 400, apiStatus.getReponseMsg(400)
    elif not judgeKeysCorrect(data, postAttrs):
        code, msg = 400, apiStatus.getReponseMsg(400)
    else:
        targetTask = Task.query.get(taskId)
        if not targetTask:
            code, msg = 404, apiStatus.getReponseMsg(404)
        else:
            try:
                targetTask.update(data)
                db.session.commit()
                result['data'] = targetTask.toDict()
                code, msg = 201, apiStatus.getReponseMsg(201)
            except:
                code, msg = 500, apiStatus.getReponseMsg(500)
    result['code'] = code
    result['message'] = msg
    return jsonify(result)

