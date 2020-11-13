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
from app.routes.timers import *
from app.routes.tasksToTimers import *

class MyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(MyJSONEncoder, self).default(obj)


def createApp(configObject):
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
    # app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    # app.config["SQLALCHEMY_ECHO"] = False
    # app.config["SQLALCHEMY_POOL_SIZE"] = 5
    # app.config["SQLALCHEMY_POOL_TIMEOUT"] = 10
    # app.config["SQLALCHEMY_POOL_RECYCLE"] = 60 # auto recycle idle connection
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.init_app(app)
        app.register_blueprint(routes)
        # db.create_all()
        # db.session.commit()


app  = createApp(DevConfig)
# createMysqlOrm(app)
db.app = app

