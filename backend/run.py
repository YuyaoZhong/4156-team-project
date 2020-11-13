from app import app
# from app.routes.tasks import *

@app.route('/')
def index():
    return 'API backend test'

@app.route('/v1')
def index1():
    return 'API backend test'

if __name__ == '__main__':
    app.run(debug=True, port=5050)
