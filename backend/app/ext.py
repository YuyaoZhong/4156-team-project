"""Extension modules for app, db"""
from flask_sqlalchemy import SQLAlchemy

# in case of repeated import
db = SQLAlchemy(use_native_unicode='utf8')
