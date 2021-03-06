#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for relations between tasks and timers
"""
import unittest
from datetime import datetime
from tests.testCase import TestCase
from app.models import Task, Timer
from app.ext import db



class TestTasksToTimers(TestCase):
    """Class to test API of relations between tasks and timers """
    def testCreateTasksToTimers(self):
        """Test create a relation between task and timers"""
        testTimerId = -100
        testTaskid = -100
        testTimer = Timer.query.get(testTimerId)
        testTask = Task.query.get(testTaskid)
        testUser = 0
        change = False
        if not testTimer:
            testTimer = Timer(id = testTimerId,
                                userId = testUser,
                                title = "test timer",
                                description="test timer description",
                                zoomLink="",
                                startTime=datetime.now().isoformat(),
                                duration = 5,
                                breakTime= 5,
                                round  = 1)
            db.session.add(testTimer)
            change = True
        if not testTask:
            testTask =  Task(id = testTaskid, userId= testUser, name = "test task", status = 0)
            db.session.add(testTask)
            change = True

        if change:
            db.session.commit()

        response = self.testApp.post('/task_timers/', json={
            "taskId": 167,
            "timerId": 106,
            "userId": '106511126518215594731'
        })

        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 201)
        self.assertEqual(str(responseBody['data']['taskId']), str(167))
        self.assertEqual(str(responseBody['data']['timerId']), str(106))
        # newTaskTestId = int(responseBody['data']['id'])

        # test duplicate with the same task and timer id, which will cause exception
        response = self.testApp.post('/task_timers/', json={
            "taskId": 167,
            "timerId": 106,
            "userId": '106511126518215594731'
        })
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 500)

        response = self.testApp.post('/task_timers/', json={
            "taskId": testTaskid,
            "timerId": testTaskid,
        })
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 400)

    def testGetTaskToTimer(self):
        """Test to get an existing relation in the database"""
        testTaskTimerId = 162
        getUrl = '/task_timers/{}'.format(testTaskTimerId)
        response = self.testApp.get(getUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)
        self.assertEqual(responseBody['data']['id'], testTaskTimerId)

    def testGetTasksByTimerId(self):
        """Test retrieve a list of tasks with timer id"""
        testTimerId = 37
        testNonexistTimerId = -500
        testUserId = '116412381383511248338'
        testAnotherUser = -1
        baseUrl = '/task_timers?userId={}&timerId={}'
        # test a work request
        testNormalUrl = baseUrl.format(testUserId, testTimerId)
        response = self.testApp.get(testNormalUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)
        self.assertEqual(len(responseBody['data']), 1)
        # test with invalid user
        testWrongUserUrl = baseUrl.format(testAnotherUser, testTimerId)
        response = self.testApp.get(testWrongUserUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)
        # test with a not-exist timer
        testNonexistTimerUrl = baseUrl.format(testUserId, testNonexistTimerId)
        response = self.testApp.get(testNonexistTimerUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 404)
    #     # test get requests without parameters required
        testWrongParasUrl = '/task_timers?userId={}'.format(testUserId)
        response = self.testApp.get(testWrongParasUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)

        testWrongParasUrl2 = '/task_timers?taskId={}&timerId={}'.format(1, testTimerId)
        response = self.testApp.get(testWrongParasUrl2)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 500)
        testWrongParasUrl3 = '/task_timers?userId={}'.format('106511126518215594731')
        response = self.testApp.get(testWrongParasUrl3)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)
        testWrongParasUrl3 = '/task_timers?userId={}'.format('106511126518215594341')
        response = self.testApp.get(testWrongParasUrl3)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 404)



    def testGetTimersByTaskId(self):
        """Test retrieve a list of timers with task id"""
        testTaskId = 147
        testNonexistTaskId = -500
        testUserId = '116412381383511248338'
        baseUrl = '/task_timers?userId={}&taskId={}'
        # test a work request
        testNormalUrl = baseUrl.format(testUserId, testTaskId)
        response = self.testApp.get(testNormalUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)
        self.assertEqual(len(responseBody['data']), 1)

        # test with a not-exist task
        testNonexistTaskUrl = baseUrl.format(testUserId, testNonexistTaskId)
        response = self.testApp.get(testNonexistTaskUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 404)
        # test get requests without parameters required
        testWrongParasUrl = '/task_timers'
        response = self.testApp.get(testWrongParasUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 500)

    def testDeleteTaskToTimer(self):
        """Test to delete an existing relation in the database
           (The effect will be rolled back)
        """
        testTaskTimerId = 162
        deleteUrl = '/task_timers/{}'.format(testTaskTimerId)
        response = self.testApp.delete(deleteUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 200)

        deleteUrl = '/task_timers/{}'.format(-300)
        response = self.testApp.delete(deleteUrl)
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 404)

if __name__ == '__main__':
    unittest.main()
