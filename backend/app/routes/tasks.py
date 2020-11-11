from app.routes import routes

@routes.route('/tasks/<taskId>')
def getTaskById(taskId):
    pass