#!/user/bin/python3
# -*- coding: utf-8 -*-

from app import createApp, db
from app.config import TestConfig
from contextlib import contextmanager
import unittest

@contextmanager
def transactionContext(testCase):
    session = testCase.app.db.session
    try:
        session.begin_nested() # open a sub-trasaction
        yield session
    finally:
        session.rollback() # does not persis the changes
        session.close()


class TestCase(unittest.TestCase):

    def setUp(self):
        self.app = createApp(TestConfig)
        self.appContext = self.app.app_context()
        self.appContext.push()
        self.testApp = self.app.test_client()
        self._savepointContext = transactionContext(self)
        self._savepointContext.__enter__()

    def tearDown(self):
        self._savepointContext.__exit__(None, None, None)
        self.appContext.pop()
        self.appContext = None
        self.testApp = None
        self.app = None



