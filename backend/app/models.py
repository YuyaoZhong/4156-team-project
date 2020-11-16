from app.ext import db

class Task(db.Model):  # pylint: disable=too-few-public-methods
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    taskListId = db.Column(db.Integer)
    name = db.Column(db.String(256), nullable=False)
    status = db.Column(db.Integer) # null = incomplete (0, 1)

    def toDict(self):
        task = {
            "id": self.id,
            "userId": self.userId,
            "taskListId": self.taskListId,
            "name": self.name,
            "status": self.status
        }
        return task

    def update(self, data):
        for key, value in data.items():
            if key == "userId":
                self.userId = value
            elif key == "taskListId":
                self.taskListId = value
            elif key == "name":
                self.name = value
            elif key == "status":
                self.status = value
        return

class TaskList(db.Model):  # pylint: disable=too-few-public-methods
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(256), nullable=False)

class Timer(db.Model):  # pylint: disable=too-few-public-methods
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(512))
    zoomLink = db.Column(db.String(512))
    startTime = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False, default=25)
    breakTime = db.Column(db.Integer, nullable=False, default=5)
    round = db.Column(db.Integer, nullable=False, default=1)

class TaskToTimer(db.Model):  # pylint: disable=too-few-public-methods
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    taskId = db.Column(db.Integer, nullable=False)
    timerId = db.Column(db.Integer, nullable=False)


