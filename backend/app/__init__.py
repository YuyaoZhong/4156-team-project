#!/user/bin/python3
# -*- coding: utf-8 -*-
"""
Initialization app module
"""
import decimal
from datetime import timedelta
from flask import Flask, json, Blueprint
from flask_cors import CORS
from app.ext import db
from app.config import SQLALCHEMY_DATABASE_URI
from app.models import *
from app.routes import routes
from app.routes.tasks import *
from app.routes.timers import *

class MyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(MyJSONEncoder, self).default(obj)


def createApp():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    # for update
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)
    app.app_context().push()
    app.json_encoder = MyJSONEncoder
    return app



def createMysqlOrm(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_ECHO"] = False
    app.config["SQLALCHEMY_POOL_SIZE"] = 5
    app.config["SQLALCHEMY_POOL_TIMEOUT"] = 10
    app.config["SQLALCHEMY_POOL_RECYCLE"] = 60 # auto recycle idle connection
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.init_app(app)
        app.register_blueprint(routes)
        # db.create_all()
        # db.session.commit()


app  = createApp()
createMysqlOrm(app)
db.app = app

