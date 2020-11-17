#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for relations between tasks and timers
"""
import unittest
from datetime import datetime
from tests.TestCase import TestCase
from app.models import Task, Timer, TaskToTimer
from app.ext import db

class TestTasksToTimers(TestCase):

    def testCreateTasksToTimers(self):
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
                                startTime=datetime.now().strftime("YYYY-MM-DD HH:MM:SS"),
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
            "taskId": testTaskid,
            "timerId": testTimerId,
            "userId": 0
        })

        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 201)
        self.assertEqual(str(responseBody['data']['taskId']), str(testTaskid))
        self.assertEqual(str(responseBody['data']['timerId']), str(testTimerId))
        newTaskTestId = int(responseBody['data']['id'])
        print(newTaskTestId)
        # test duplicates
        response = self.testApp.post('/task_timers/', json={
            "taskId": testTaskid,
            "timerId": testTaskid,
            "userId": 0
        })
        responseBody = response.get_json()
        self.assertEqual(responseBody['code'], 500)

        getUrl = '/task_timers/{}'.format(newTaskTestId)
        response = self.testApp.get(getUrl)
        responseBody = response.get_json()
        print(responseBody)
        # self.assertEqual(responseBody['code'], 200)

    def testGetTaskToTimer(self):
        pass
        # getUrl = '/task_timers/{}'.format(newTaskTestId)
        # response = self.testApp.get(getUrl)
        # responseBody = response.get_json()
        # print(responseBody)

if __name__ == "__main__":
    unittest.main()


