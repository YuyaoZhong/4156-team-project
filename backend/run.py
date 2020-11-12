from app import application
from app.routes import routes

application.register_blueprint(routes)

@application.route('/')
def index():
    return 'API backend test'


if __name__ == '__main__':
    application.run(debug=True, port=5000)
