"""The main file to run the application"""
from app import app
import cryptography

@app.route('/')
def index():
    """A test page for the api"""
    return 'API backend test'

if __name__ == '__main__':
    # app.run(debug=True, ssl_context=('server.crt', 'server.key'), port=5050)

    app.run(port = 8000, debug = False)