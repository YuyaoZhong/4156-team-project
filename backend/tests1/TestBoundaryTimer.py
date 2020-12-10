#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for timers
"""
import unittest
from tests.testCase import TestCase
from app.models import Timer


class TestTimersBoundary(TestCase):
    """Class to test timers Boundary """
    def testCreateTimersValid(self):
        """test create timers"""
        appResponse = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 1,
                                           "startTime": "2020-11-22T04:01:00.000Z",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 201)

    def testCreateTimersInvalid(self):
        """test to create timers without required parameters"""
        appResponse = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 100000000, "id": 1, "round": 1,
                                           "startTime": "2020-11-22T04:01:00.000Z",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testCreateTimersBoundary(self):
        """test to create timers without required parameters"""
        appResponse = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 65535, "id": 1, "round": 1,
                                           "startTime": "2020-11-22T04:01:00.000Z",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 201)

    def testGetTimersValid(self):
        """test to get a timer by id"""
        appResponse = self.testApp.get('/timers/?timerId=9')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testGetTimersInvalid(self):
        """test to retrieve a non-existing timer"""
        appResponse = self.testApp.get('/timers/?timerId=100000')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testGetTimersBoundary(self):
        """test to retrieve a non-existing timer"""
        appResponse = self.testApp.get('/timers/?timerId=65535')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 404)

    def testUpdateTimersValid(self):
        """test to update a timer"""
        appResponse = self.testApp.put('/timers/9', json={"breakTime": 15})
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 201)

    def testUpdateTimersInvalid(self):
        """test to update a timer"""
        appResponse = self.testApp.put('/timers/9', json={"breakTime": 100000})
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testUpdateTimersBoundary(self):
        """test to update a timer"""
        appResponse = self.testApp.put('/timers/9', json={"breakTime": 65535})
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 201)

    def testDeleteTimersValid(self):
        """test to delete timers"""
        appResponse1 = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "round": 1,
                                           "startTime": "2020-11-22T04:01:00.000Z",
                                           "title": "test timer", "userId": "99", "zoomLink": ""
        })
        jsonData = appResponse1.get_json()
        id = jsonData['data']['id']
        appResponse2 = self.testApp.delete('/timers/%s' %id)
        jsonData = appResponse2.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testDeleteTimersInValid(self):
        """test to delete timers"""
        appResponse1 = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "round": 1,
                                           "startTime": "2020-11-22T04:01:00.000Z",
                                           "title": "test timer", "userId": "99", "zoomLink": ""
        })
        jsonData = appResponse1.get_json()
        id = jsonData['data']['id']
        appResponse2 = self.testApp.delete('/timers/100000' )
        jsonData = appResponse2.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testDeleteTimersBoundary(self):
        """test to delete timers"""
        appResponse1 = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "round": 1,
                                           "startTime": "2020-11-22T04:01:00.000Z",
                                           "title": "test timer", "userId": "99", "zoomLink": ""
        })
        jsonData = appResponse1.get_json()
        id = jsonData['data']['id']
        appResponse2 = self.testApp.delete('/timers/65535' )
        jsonData = appResponse2.get_json()
        self.assertEqual(jsonData['code'], 404)


if __name__ == '__main__':
    unittest.main()
