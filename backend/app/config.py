DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'admin'
PASSWORD = '*********'
HOST = 'timerdb.cs0xiee1s8w3.us-west-2.rds.amazonaws.com'
PORT = '3306'
DATABASE = 'timerdb' # not create


SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=utf8'.format(
    DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE
)
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = False
