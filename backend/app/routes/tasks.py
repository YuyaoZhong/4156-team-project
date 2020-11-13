from app.routes import routes

@routes.route('/tasks')
def testTask():
    return "tasks url"

@routes.route('/tasks/<taskId>', methods=["GET"])
def getTaskById(taskId):
    return taskId