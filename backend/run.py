"""The main file to run the application"""
from app import app

@app.route('/')
def index():
    """A test page for the api"""
    return 'API backend test'

if __name__ == '__main__':
    app.run(debug=True, port=5050)
