#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for task lists
"""
import unittest
from flask import json
from tests.testCase import TestCase

class TestBoundaryTaskLists(TestCase):
    """Class for equivalence partition of task list API"""
    def testValidCreateTaskLists(self):
        """Equivalence Partition for invalid input for createTaskLists"""
        response = self.testApp.post('/tasklists', json={
            "name": "Dummy task list",
            "userId": '0'
        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 201)
        self.assertEqual(data['name'], 'Dummy task list')
        self.assertEqual(data['userId'], '0')

    def testInvalidCreateTaskLists(self):
        """Equivalence Partition for invalid input for createTaskLists"""
        response = self.testApp.post('/tasklists', json={
            "name": "A" * 2048,
            "userId": '0'
        })
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)


    def testBoundaryCreateTaskLists(self):
        """Equivalence Partition for boundary case input for createTaskLists"""
        response = self.testApp.post('/tasklists', json={
            "name": "A"*140,
            "userId": '0'
        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 201)
        self.assertEqual(data['name'], "A"*140)
        self.assertEqual(data['userId'], '0')

    def testValidGetTaskLists(self):
        """Equivalence Partition for valid input for getTaskLists"""
        response = self.testApp.post('/tasklists', json={
            "name": "Get task list",
            "userId": '1'
        })
        resp = json.loads(response.data)
        data = resp['data']
        taskListId = data['id']

        response = self.testApp.get('/tasklists/'+str(taskListId))
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 200)
        self.assertEqual(data['name'], 'Get task list')
        self.assertEqual(data['userId'], '1')

    def testInvalidTooLargeGetTaskLists(self):
        """Equivalence Partition for invalid input for getTaskLists"""
        response = self.testApp.get('/tasklists/'+str(1048576))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testInvalidTooSmallGetTaskLists(self):
        """Equivalence Partition for invalid input for getTaskLists"""
        response = self.testApp.get('/tasklists/'+str(-1048576))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)
    # We cannot make sure if there is a valid ID for the boundary case,
    # so no boundary test is included

    def testValidPutTaskLists(self):
        """Equivalence Partition for valid input for putTaskLists"""
        response = self.testApp.post('/tasklists', json={
            "name": "Default task list",
            "userId": '1'
        })
        resp = json.loads(response.data)
        data = resp['data']
        taskListId = data['id']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.put('/tasklists/' + str(taskListId), json={
            "name": "Put task list",
            "userId": '2'
        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.get('/tasklists/'+str(taskListId))
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 200)
        self.assertEqual(data['name'], 'Put task list')
        self.assertEqual(data['userId'], '2')

    def testInvalidPutTaskLists(self):
        """Equivalence Partition for invalid input for putTaskLists"""
        response = self.testApp.post('/tasklists', json={
            "name": "Default task list",
            "userId": '1'
        })
        resp = json.loads(response.data)
        data = resp['data']
        taskListId = data['id']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.put('/tasklists/' + str(taskListId), json={
            "name": "A" * 2048,
            "userId": '2'
        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 400)

    def testBoundaryPutTaskLists(self):
        """Equivalence Partition for boundary case input for putTaskLists"""
        response = self.testApp.post('/tasklists', json={
            "name": "Default task list",
            "userId": '1'
        })
        resp = json.loads(response.data)
        data = resp['data']
        taskListId = data['id']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.put('/tasklists/' + str(taskListId), json={
            "name": "A" * 140,
            "userId": '2'
        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.get('/tasklists/'+str(taskListId))
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 200)
        self.assertEqual(data['name'], "A" * 140)
        self.assertEqual(data['userId'], '2')

    def testValidDeleteTaskLists(self):
        """Equivalence Partition for valid input for deleteTaskLists"""
        response = self.testApp.post('/tasklists', json={
            "name": "Get task list",
            "userId": '1'
        })
        resp = json.loads(response.data)
        data = resp['data']
        taskListId = data['id']

        response = self.testApp.delete('/tasklists/'+str(taskListId))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 201)

    def testInvalidTooLargeDeleteTaskLists(self):
        """Equivalence Partition for invalid input for deleteTaskLists"""
        response = self.testApp.delete('/tasklists/'+str(1048576))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testInvalidTooSmallDeleteTaskLists(self):
        """Equivalence Partition for invalid input for deleteTaskLists"""
        response = self.testApp.delete('/tasklists/'+str(-1048576))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    # We cannot make sure if there is a valid ID for the boundary case,
    # so no boundary test is included

    def testValidGetTaskListsByUserId(self):
        """Equivalence Partition for valid input for getTaskListsByUserId"""
        response = self.testApp.get('/tasklists?userId=test1')
        jsonData = response.get_json()
        data = jsonData['data']
        oldLen = 0
        if data:
            oldLen = len(data)

        self.testApp.post('/tasklists', json={
            "name": "Default task list 1",
            "userId": 'test1'
        })

        self.testApp.post('/tasklists', json={
            "name": "Default task list 2",
            "userId": 'test1'
        })

        self.testApp.post('/tasklists', json={
            "name": "Default task list 3",
            "userId": 'test2'
        })

        response = self.testApp.get('/tasklists?userId=test1')
        resp = json.loads(response.data)
        data = resp['data']

        self.assertEqual(resp['code'], 200)
        self.assertEqual(len(data) - oldLen, 2)
        self.assertTrue('Default task list 1' in (taskList['name'] for taskList in data))
        self.assertTrue('Default task list 2' in (taskList['name'] for taskList in data))

    def testInvalidGetTaskListsByUserId(self):
        """Equivalence Partition for invalid input for getTaskListsByUserId"""

        response = self.testApp.get('/tasklists?userId='+'1'*2000)
        resp = json.loads(response.data)

        self.assertEqual(resp['code'], 400)

    # We cannot make sure if there is a valid ID for the boundary case,
    # so no boundary test is included

if __name__ == "__main__":
    unittest.main()
