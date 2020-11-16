from app.ext import db

class Task(db.Model):  # pylint: disable=too-few-public-methods
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    taskListId = db.Column(db.Integer)
    name = db.Column(db.String(256), nullable=False)
    status = db.Column(db.Integer) # null = incomplete (0, 1)

class TaskList(db.Model):  # pylint: disable=too-few-public-methods
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(256), nullable=False)

class Timer(db.Model):  # pylint: disable=too-few-public-methods
    # pylint: disable=too-many-instance-attributes
    # Eight is reasonable in this case.
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(512))
    zoomLink = db.Column(db.String(512))
    startTime = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False, default=25)
    breakTime = db.Column(db.Integer, nullable=False, default=5)
    round = db.Column(db.Integer, nullable=False, default=1)

    def toDict(self):
        timer = {
            "id": self.id,
            "userId": self.userId,
            "title": self.title,
            "description": self.description,
            "zoomLink": self.zoomLink,
            "startTime": self.startTime,
            "duration": self.duration,
            "breakTime": self.breakTime,
            "round": self.round
        }
        return timer
    def update(self,data):
        for key, value in data.items():
            if key == "userId":
                self.userId = value
            elif key == "title":
                self.title = value
            elif key == "description":
                self.description = value
            elif key == "zoomLink":
                self.zoomLink = value
            elif key == "startTime":
                self.startTime = value
            elif key == "duration":
                self.duration = value
            elif key == "breakTime":
                self.breakTime = value
            elif key == "round":
                self.round = value


class TaskToTimer(db.Model):  # pylint: disable=too-few-public-methods
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    taskId = db.Column(db.Integer, nullable=False)
    timerId = db.Column(db.Integer, nullable=False)

    def toDict(self):
        taskToTimer = {
            "id": self.id,
            "taskId": self.taskId,
            "timerId": self.timerId
        }
        return taskToTimer


