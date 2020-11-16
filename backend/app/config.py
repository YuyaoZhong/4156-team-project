"""Database connection configuration

DIALECT  -  type of database.
DRIVER  - sql driver for python.

"""
import os
from datetime import timedelta

DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'admin'
PASSWORD = os.environ.get('MYSQL_PASSWORD', "")
HOST = 'timerdb.cs0xiee1s8w3.us-west-2.rds.amazonaws.com'
PORT = '3306'
DATABASE = 'timerdb' # not create

SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=utf8'.format(
    DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE
)
# SQLALCHEMY_COMMIT_ON_TEARDOWN = True
# SQLALCHEMY_TRACK_MODIFICATIONS = False

print(PASSWORD)
class DevConfig(object):
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_ECHO = False
    # SQLALCHEMY_POOL_SIZE = 5
    # SQLALCHEMY_POOL_TIMEOUT = 10
    # SQLALCHEMY_POOL_RECYCLE = 60  # auto recycle idle connection
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_timeout': 10,
        'pool_size': 5,
        'pool_recycle': 60
    }
    SEND_FILE_MAX_AGE_DEFAULT = timedelta(seconds=1)

class TestConfig(DevConfig):
    DEBUG = True
    TESTING = True
    ENV = 'test'
