#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for task lists
"""
from flask import json
from tests.TestCase import TestCase
import unittest

class TestTaskLists(TestCase):
    def testCreateTaskLists(self):
        response = self.testApp.post('/tasklists', json={
            "name": "Dummy task list",
            "userId": '0'
        })
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 201)
        self.assertEqual(data['name'], 'Dummy task list')
        self.assertEqual(data['userId'], '0')

    def testGetTaskLists(self):
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

    def testPutTaskLists(self):
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

    def testDeleteTaskLists(self):
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
        data = resp['data']
        self.assertEqual(resp['code'], 201)

        response = self.testApp.get('/tasklists/' + str(taskListId))
        resp = json.loads(response.data)
        data = resp['data']
        self.assertEqual(resp['code'], 404)


if __name__ == "__main__":
    unittest.main()
