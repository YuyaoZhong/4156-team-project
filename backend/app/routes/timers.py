from app.routes import routes

@routes.route('/timers')
def testTimers():
    return "timers url"