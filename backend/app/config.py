"""Database connection configuration

DIALECT  -  type of database.
DRIVER  - sql driver for python.
PASSWORD - should be set in .env
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()
DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'admin'
#PASSWORD = os.environ.get('MYSQL_PASSWORD', "")
PASSWORD = 'admin123'
HOST = 'timerdb.cs0xiee1s8w3.us-west-2.rds.amazonaws.com'
PORT = '3306'
DATABASE = 'timerdb' # not create

SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=utf8'.format(
    DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE
)

# print(PASSWORD)
class DevConfig():  # pylint: disable=too-few-public-methods
    """Configuration for DEV environment"""
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

class TestConfig(DevConfig):  # pylint: disable=too-few-public-methods
    """Configuration for unit tests"""
    DEBUG = True
    TESTING = True
    ENV = 'test'
