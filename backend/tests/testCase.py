#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Base class implemented for tests"""

from contextlib import contextmanager
import unittest
from app import createApp
from app.config import TestConfig

@contextmanager
def transactionContext(testCase):
    """Rollback transactions after tests"""
    session = testCase.app.db.session
    try:
        session.begin_nested() # open a sub-trasaction
        yield session
    finally:
        session.rollback() # does not persis the changes
        session.close()


class TestCase(unittest.TestCase):
    """Basic class for testcase"""
    def setUp(self):
        """Set up application for the tests"""
        # print(os.environ.get('MYSQL_PASSWORD'))
        self.app = createApp(TestConfig)
        self.appContext = self.app.app_context()
        self.appContext.push()
        self.testApp = self.app.test_client()
        self._savepointContext = transactionContext(self)
        # the context has member of enter or exist
        self._savepointContext.__enter__() # pylint: disable=maybe-no-member

    def tearDown(self):
        """Close application for the tests"""
        self._savepointContext.__exit__(None, None, None) # pylint: disable=maybe-no-member
        self.appContext.pop()
        self.appContext = None
        self.testApp = None
        self.app = None
