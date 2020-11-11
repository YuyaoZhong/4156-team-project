from flask import Flask, json
import decimal
from flask_cors import CORS
from datetime import timedelta
from app.ext import db
from app.config import SQLALCHEMY_DATABASE_URI


class MyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(MyJSONEncoder, self).default(obj)


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    # for update
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)
    app.app_context().push()
    app.json_encoder = MyJSONEncoder
    return app



def create_mysql_ORM(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_ECHO"] = False
    app.config["SQLALCHEMY_POOL_SIZE"] = 5
    app.config["SQLALCHEMY_POOL_TIMEOUT"] = 10
    app.config["SQLALCHEMY_POOL_RECYCLE"] = 60 # auto recycle idle connection
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.init_app(app)
        db.Model.metadata.reflect(db.engine)
        db.reflect()
        all_table = {table_obj.name: table_obj for table_obj in db.get_tables_for_bind()}
        ts_table = all_table["products_price_compress"]
    return ts_table


app  = create_app()
ts_table = create_mysql_ORM(app) # mark: no need to return ts_table
# cache = set_up_cache(app)
db.app = app
db.init_app(app)