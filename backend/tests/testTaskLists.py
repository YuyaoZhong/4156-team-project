#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for task lists
"""
import unittest
from flask import json
from tests.testCase import TestCase

class TestTaskLists(TestCase):
    """Class to test task list API"""
    def testCreateTaskLists(self):
        """test to create a task list"""
        response = self.testApp.post('/tasklists', json={
            "name": "Dummy task list",
            "userId": '0'
        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 201)
        self.assertEqual(data['name'], 'Dummy task list')
        self.assertEqual(data['userId'], '0')

        response = self.testApp.post('/tasklists', json={
            "name": "Dummy task list",
            "notAUserId": '0'
        })
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

        response = self.testApp.post('/tasklists', json={})
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

    def testGetTaskLists(self):
        """test to retrieve a task list"""
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

        response = self.testApp.get('/tasklists/'+'0')
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)


    def testPutTaskLists(self):
        """test to edit task list"""
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

        response = self.testApp.put('/tasklists/' + '0', json={})
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)

        response = self.testApp.put("/tasklists/" + "NotAnInteger", json={})
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 400)



    def testDeleteTaskLists(self):
        """test to delete a task list"""
        response = self.testApp.post('/tasklists', json={
            "name": "Default task list",
            "userId": '1'
        })
        resp = json.loads(response.data)
        data = resp['data']
        taskListId = data['id']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.delete('/tasklists/' + str(taskListId))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 201)

        response = self.testApp.get('/tasklists/' + str(taskListId))
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)

        response = self.testApp.delete('/tasklists/' + '0')
        resp = json.loads(response.data)
        self.assertEqual(resp['code'], 404)


    def testGetTaskListsByUserId(self):
        """test to retrieve all the tasklists given an user id"""
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

        response = self.testApp.get('/tasklists?userId=test3')
        resp = json.loads(response.data)

        self.assertEqual(resp['code'], 404)

if __name__ == "__main__":
    unittest.main()
