#!/user/bin/python3
# -*- coding: utf-8 -*-
"""task
"""
from app.routes import routes

@routes.route('/tasklist')
def testTasklist():
    return "tasklist url"

@routes.route('/tasklist/<tasklistId>', methods=["GET"])
def getTasklistById(tasklistId):
    return tasklistId