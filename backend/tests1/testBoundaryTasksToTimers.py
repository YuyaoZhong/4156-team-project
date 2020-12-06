#!/user/bin/python3
# -*- coding: utf-8 -*-
# @Project: backend
# @Time : 2020/12/3
# @Author: Yuyao Zhong
# @Email: yz3618@columbia.edu

import unittest
from datetime import datetime
from tests.testCase import TestCase
from app.models import Task, Timer
from app.ext import db
from app.routes.tasksToTimers import getTaskTimer, getTimersByTaskid, getTasksByTimerid



class TestBoundaryTasksToTimers(TestCase):
    def testInputHandleTaskTimer(self):
        baseUrl = '/task_timers/{}'
        tooSmallId = -100000
        normalExistId = 162
        onBoundaryLowId = -1000
        tooBigId = 700000
        response = self.testApp.get(baseUrl.format(tooSmallId))
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 400)

        response = self.testApp.get(baseUrl.format(tooBigId))
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 400)

        response = self.testApp.get(baseUrl.format(normalExistId))
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)

        response = self.testApp.get(baseUrl.format(onBoundaryLowId))
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'] != 400, True)

    def testInputGetTaskTimer(self):
        tooSmallId = -100000
        normalExistId = 162
        onBoundaryId = 65535
        tooBigId = 700000

        code, msg, data = getTaskTimer(tooSmallId)
        self.assertEqual(code, 400)

        code, msg, data = getTaskTimer(tooBigId)
        self.assertEqual(code, 400)

        code, msg, data = getTaskTimer(normalExistId)
        self.assertEqual(code, 200)

        code, msg, data = getTaskTimer(onBoundaryId)
        self.assertEqual(code != 400, True)

    def testInputQueryTasksOrTimers(self):
        tooLongString = "a" * 200
        onBoundaryString = "a" * 140
        normalExistId = "0"
        tooSmallId = -100000

        testUrl1 = '/task_timers?userId={}'.format(tooLongString)
        response = self.testApp.get(testUrl1)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 400)

        testUrl2 = '/task_timers?userId={}'.format(normalExistId)
        response = self.testApp.get(testUrl2)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)

        testUrl3 = '/task_timers?userId={}&taskId={}'.format(normalExistId, tooSmallId)
        response = self.testApp.get(testUrl3)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 400)

        testUrl4 = '/task_timers?userId={}'.format(onBoundaryString)
        response = self.testApp.get(testUrl4)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'] != 400, True)


    def testGetTasksByTimerid(self):
        tooSmallId = -120000
        normalExistId = -200
        onBoundaryId = 65535
        tooBigId = 800000

        code, msg, data = getTasksByTimerid(tooSmallId)
        self.assertEqual(code, 400)

        code, msg, data = getTasksByTimerid(tooBigId)
        self.assertEqual(code, 400)

        code, msg, data = getTasksByTimerid(normalExistId)
        self.assertEqual(code, 200)

        code, msg, data = getTasksByTimerid(onBoundaryId)
        self.assertEqual(code != 400, True)

    def testGetTimerByTaskId(self):
        tooSmallId = -2000000
        normalExistId = 170
        onBoundaryId = 65535
        tooBigId = 800000

        code, msg, data = getTimersByTaskid(tooSmallId)
        self.assertEqual(code, 400)

        code, msg, data = getTimersByTaskid(tooBigId)
        self.assertEqual(code, 400)

        code, msg, data = getTimersByTaskid(normalExistId)
        self.assertEqual(code, 200)

        code, msg, data = getTasksByTimerid(onBoundaryId)
        self.assertEqual(code != 400, True)


    def testCreateTaskTimer(self):
        testTooLongData = {
            "taskId": -100,
            "timerId": -200,
            "userId": "b" * 200
        }

        testOnBoundaryData = {
            "id": -110,
            "taskId": -100,
            "timerId": -200,
            "userId": "b" * 140
        }

        response = self.testApp.post('/task_timers/', json=testTooLongData)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 400)

        response = self.testApp.post('/task_timers/', json=testOnBoundaryData)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'] != 400, True)


    def testDeleteTask(self):
        tooSmallId = -120000
        onBoundaryId = -1000
        tooBigId = 78798545

        basicDeleteUrl = '/task_timers/{}'

        response = self.testApp.delete(basicDeleteUrl.format(tooSmallId))
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 400)

        response = self.testApp.delete(basicDeleteUrl.format(tooBigId))
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 400)

        response = self.testApp.delete(basicDeleteUrl.format(onBoundaryId))
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'] != 400, True)


if __name__ == '__main__':
    unittest.main()
