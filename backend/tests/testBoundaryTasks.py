#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for task lists
"""
import unittest
from flask import json
from tests.testCase import TestCase

class TestTask(TestCase):
    """Create a class to test task APIs"""
    def testCreateTasks(self):
        """test to create a task"""
        response = self.testApp.post('/tasks', json={
            "userId": 'test1',
            "taskListId": '78',
            "name": "Dummy task",
            "status": False

        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 201)
        self.assertEqual(data['status'], False)

    def testInvalidCreateTasks(self):
        """test to create a task"""
        response = self.testApp.post('/tasks', json={
            "userId": 'test1',
            "taskListId": '78',
            "name": "A" * 2048,
            "status": False

        })
        resp = json.loads(response.data)
        #data = resp['data']
        self.assertEqual(resp['code'], 400)

    def testBoundaryCreateTasks(self):
        """test to create a task"""
        response = self.testApp.post('/tasks', json={
            "userId": 'test1',
            "taskListId": '78',
            "name": "A" * 140,
            "status": False

        })
        resp = json.loads(response.data)
        #data = resp['data']
        self.assertEqual(resp['code'], 201)

    def testCreateTasksFail(self):
        """test to create a repeated task"""
        response = self.testApp.post('/tasks', json={
            "userId": 'test1',
            "taskListId": '78',
            "ErrorName": "Dummy task",
            "status": False
        })
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

        response = self.testApp.post('/tasks', json={})
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testGetTasks(self):
        """test to retrieve a task"""
        response = self.testApp.post('/tasks', json={
            "userId": 'test1',
            "taskListId": '78',
            "name": "Get task",
            "status": False

        })
        resp = json.loads(response.data)
        data = resp['data']
        taskId = data['id']

        response = self.testApp.get('/tasks/'+str(taskId))
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 200)
        self.assertEqual(data['status'], False)

    def testInvalidGetTasksBig(self):
        """test to retrieve a task"""
        response = self.testApp.get('/tasks/'+str(65537))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testInvalidGetTasksSmall(self):
        """test to retrieve a task"""
        response = self.testApp.get('/tasks/'+str(-1001))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testInvalidGetTasks2(self):
        """test to retrieve a task"""
        A = 'A' * 2048
        response = self.testApp.get(f'/tasks?taskId={A})')
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testGetTasksFail(self):
        """test to get a task that does not exist"""
        response = self.testApp.get('/tasks/'+'9999')
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)

    def testGetTasksFail1(self):
        """test to get a task by id"""

        response = self.testApp.get('/tasks?taskId=-100')
        jsonData = response.get_json()
        self.assertEqual(jsonData['code'], 200)

        response = self.testApp.get('/tasks?userId=0')
        jsonData = response.get_json()
        self.assertEqual(jsonData['code'], 200)

        response = self.testApp.get('/tasks')
        jsonData = response.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testPutTasks(self):
        """test to edit a task"""
        response = self.testApp.put('/tasks/-100', json={
            "userId": 'test1',
            "name": "test task",
            "status": False
        })

        resp = json.loads(response.data)
        data = resp['data']
        taskId = data['id']
        self.assertEqual(resp['code'], 201)

    def testInvalidPutTasksUserId(self):
        """test to edit a task"""
        response = self.testApp.put('/tasks/-100', json={
            "userId": 'A' * 2048,
            "name": "test task",
            "status": False
        })

        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 400)

    def testInvalidPutTasksName(self):
        """test to edit a task"""
        response = self.testApp.put('/tasks/-100', json={
            "userId": 'test1',
            "name": "B" * 1024,
            "status": False
        })

        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 400)

    def testInvalidPutTasks2(self):
        """test to retrieve a task"""
        A = 'A' * 2048
        response = self.testApp.put(f'/tasks/{A})')
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testPutTasksFail(self):
        """test to edit a non-existing task"""
        response = self.testApp.put('/tasks/' + '200', json={})
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testDeleteTasks(self):
        """test to delete a task"""
        response = self.testApp.post('/tasks', json={
            "userId": 'test1',
            "taskListId": '78',
            "name": "Delete task",
            "status": False

        })
        resp = json.loads(response.data)
        data = resp['data']
        taskId = data['id']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.delete('/tasks/' + str(taskId))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 201)

        response = self.testApp.get('/tasks/' + str(taskId))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)

    def testInvalidDeleteTasksFailBig(self):
        """test to delete a non-existing task"""
        response = self.testApp.delete('/tasks/' + str(65537))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testInvalidDeleteTasksFailSmall(self):
        """test to delete a non-existing task"""
        response = self.testApp.delete('/tasks/' + str(-1001))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testInvalidDeleteTasksFailBigBound(self):
        """test to delete a non-existing task"""
        response = self.testApp.delete('/tasks/' + str(65535))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)

    def testInvalidDeleteTasksFailSmallBound(self):
        """test to delete a non-existing task"""
        response = self.testApp.delete('/tasks/' + str(-1000))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)

    def testDeleteTasksFail(self):
        """test to delete a non-existing task"""
        response = self.testApp.delete('/tasks/' + '9999')
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)

if __name__ == '__main__':
    unittest.main()

