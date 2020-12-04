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

    def testDeleteTasksFail(self):
        """test to delete a non-existing task"""
        response = self.testApp.delete('/tasks/' + '9999')
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)

if __name__ == '__main__':
    unittest.main()
