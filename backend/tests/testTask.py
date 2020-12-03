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
            "userId": '0',
            "taskListId": '-1',
            "name": "Dummy task",
            "status": False

        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 201)
        self.assertEqual(data['userId'], '0')
        self.assertEqual(data['taskListId'], '-1')
        self.assertEqual(data['name'], 'Dummy task')
        self.assertEqual(data['status'], False)

    def testCreateTasksFail(self):
        """test to create a repeated task"""
        response = self.testApp.post('/tasks', json={
            "userId": '0',
            "taskListId": '-1',
            "ErrorName": "Dummy task",
            "status": False
        })
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

        response = self.testApp.post('/tasks', json={})
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testGetTasks(self):
        """tset to retrieve a task"""
        response = self.testApp.post('/tasks', json={
            "userId": '0',
            "taskListId": '-1',
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
        self.assertEqual(data['userId'], '0')
        self.assertEqual(data['taskListId'], -1)
        self.assertEqual(data['name'], 'Get task')
        self.assertEqual(data['status'], False)

    def testGetTasksFail(self):
        """test to get a task that does not exist"""
        response = self.testApp.get('/tasks/'+'9999')
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)

    def testPutTasks(self):
        """test to edit a task"""
        response = self.testApp.post('/tasks', json={
            "userId": '0',
            "taskListId": '-1',
            "name": "Get task",
            "status": False

        })
        resp = json.loads(response.data)
        data = resp['data']
        taskId = data['id']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.put('/tasks/' + str(taskId), json={
            "userId": '1',
            "taskListId": '-2',
            "name": "Put task",
            "status": True
        })

        resp = json.loads(response.data)
        data = resp['data']
        taskId = data['id']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.get('/tasks/'+str(taskId))
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 200)
        self.assertNotEqual(data['userId'], '0')
        self.assertNotEqual(data['taskListId'], -1)
        self.assertNotEqual(data['name'], 'Get task')
        self.assertNotEqual(data['status'], False)
        self.assertEqual(data['userId'], '1')
        self.assertEqual(data['taskListId'], -2)
        self.assertEqual(data['name'], 'Put task')
        self.assertEqual(data['status'], True)

    def testPutTasksFail(self):
        """test to edit a non-existing task"""
        response = self.testApp.put('/tasks/' + '200', json={})
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testDeleteTasks(self):
        """test to delete a task"""
        response = self.testApp.post('/tasks', json={
            "userId": '0',
            "taskListId": '-1',
            "name": "Get task",
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
