#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for relations between tasks and timers
"""
from tests.TestCase import TestCase
import unittest

class TestTasksToTimers(TestCase):
    def testCreateTasksToTimers(self):
        self.testApp.post('/task_timers/', json={
            "taskId": 1,
            "timerId": 1,
            "userId": 0
        })


if __name__ == "__main__":
    unittest.main()


