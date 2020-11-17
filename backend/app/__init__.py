#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Initialization app module
routes - RESTful APIs for data manipulation
"""
import decimal
from flask import Flask, json, Blueprint
from flask_cors import CORS
from app.ext import db
from app.config import DevConfig
from app.models import *
from app.routes import routes
from app.routes.tasks import *
from app.routes.tasklists import *
from app.routes.timers import *
from app.routes.tasklists import *
from app.routes.tasksToTimers import *


class MyJSONEncoder(json.JSONEncoder):
    """ JSON Encoder for possible decimal data"""
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        # return super(MyJSONEncoder, self).default(obj)
        return super().__init__()

def createApp(configObject):
    """ Create a flask application"""
    app = Flask(__name__)
    app.config.from_object(configObject)
    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    app.db = db
    app.register_blueprint(routes)
    # for update
    app.app_context().push()
    app.json_encoder = MyJSONEncoder
    return app



def createMysqlOrm(app):
    """ Init the application with database setting"""
    with app.app_context():
        db.init_app(app)
        app.register_blueprint(routes)
        # db.create_all()
        # db.session.commit()


app = createApp(DevConfig)
# createMysqlOrm(app)
db.app = app
