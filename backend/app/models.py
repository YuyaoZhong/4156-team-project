"""Models for the application"""
from datetime import datetime
from app.ext import db


class Task(db.Model):  # pylint: disable=too-few-public-methods
    """Task models"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    taskListId = db.Column(db.Integer)
    name = db.Column(db.String(256), nullable=False)
    status = db.Column(db.Integer) # null = incomplete (0, 1)

    def toDict(self):
        """Transfer the model to dictionary"""
        task = {
            "id": self.id,
            "userId": self.userId,
            "taskListId": self.taskListId,
            "name": self.name,
            "status": self.status
        }
        return task

    def update(self, data):
        """Update tasks"""
        for key, value in data.items():
            if key == "userId":
                self.userId = value
            elif key == "taskListId":
                self.taskListId = value
            elif key == "name":
                self.name = value
            elif key == "status":
                self.status = value

class TaskList(db.Model):  # pylint: disable=too-few-public-methods
    """Task list model"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(256), nullable=False)

    def toDict(self):
        """Transfer the model to dictionary"""
        taskList = {
            "id": self.id,
            "userId": self.userId,
            "name": self.name
        }
        return taskList

    def update(self, data):
        """Update the model """
        for key, value in data.items():
            if key == "userId":
                self.userId = value
            elif key == "name":
                self.name = value

class Timer(db.Model):  #pylint: disable=too-few-public-methods
    # pylint: disable=too-many-instance-attributes
    # Eight is reasonable in this case.
    """this class is for the server to handle with the Timer table in database"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(256), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(512))
    zoomLink = db.Column(db.String(512))
    startTime = db.Column(db.String(512), nullable=False)
    duration = db.Column(db.Integer, nullable=False, default=25)
    breakTime = db.Column(db.Integer, nullable=False, default=5)
    round = db.Column(db.Integer, nullable=False, default=1)

    def toDict(self, otherAttrs = None):
        """this function is for the server to turn Timer class into dic in python"""
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
        if otherAttrs and len(otherAttrs) != 0 and isinstance(otherAttrs, dict):
            timer.update(otherAttrs)
        return timer
    def update(self,data):
        """this function is for the server to update the Timer class"""
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
    """This model manages relations between tasks and timers"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    taskId = db.Column(db.Integer, nullable=False)
    timerId = db.Column(db.Integer, nullable=False)
    userId = db.Column(db.String(256), nullable=False)

    def update(self, data):
        """this function is for the server to update the relation class"""
        for key, value in data.items():
            if key == "timerId":
                self.timerId = value
            elif key == "taskId":
                self.taskId = value
            elif key == "id":
                self.id = value

    def toDict(self):
        """Change the object to dictionary"""
        taskToTimer = {
            "id": self.id,
            "taskId": self.taskId,
            "timerId": self.timerId,
            "userId": self.userId
        }
        return taskToTimer

class TimerToUser(db.Model):  # pylint: disable=too-few-public-methods
    """This model manages relations between users and timers"""
    timerId = db.Column(db.Integer, nullable=False, primary_key=True)
    userId = db.Column(db.String(256), nullable=False, primary_key=True)
    status = db.Column(db.Boolean, nullable=False)

    def toDict(self):
        """Change the object to dictionary"""
        timerToUser = {
            "timerId": self.timerId,
            "userId": self.userId,
            "status": self.status
        }
        return timerToUser
