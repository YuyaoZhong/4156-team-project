from app import app
from app.routes import *

app.register_blueprint(routes,  url_prefix='/v1')

@app.route('/')
def index():
    return 'API backend test'

@app.route('/v1')
def version_1():
    return 'v1 page'

if __name__ == '__main__':
    app.run(debug=True, port=8000)