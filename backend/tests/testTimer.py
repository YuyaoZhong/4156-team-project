#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for relations between tasks and timers
"""
from tests.TestCase import TestCase
import unittest


class TestTimers(TestCase):
    def testCreateTimers(self):
        rv = self.testApp.post('/timers', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 1,
                                           "startTime": "Thu, 12 Nov 2020 21:05:19 GMT",
                                           "title": "test timer", "userId": "0", "zoomLink": ""
        })
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 201)

    def testGetTimers(self):
        rv = self.testApp.get('/timers/1')
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 200)

    def testUpdateTimers(self):
        rv = self.testApp.put('/timers/1', json={"breakTime": 15})
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 200)

    def testDeleteTimers(self):
        rv1 = self.testApp.post('/timers', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 1,
                                           "startTime": "Thu, 12 Nov 2020 21:05:19 GMT",
                                           "title": "test timer", "userId": "0", "zoomLink": ""
        })
        json_data = rv1.get_json()
        id = json_data['data']['id']
        rv2 = self.testApp.put('/timers/%s' %id, json={"breakTime": 15})
        json_data = rv2.get_json()
        self.assertEqual(json_data['code'], 200)



if __name__ == '__main__':
    unittest.main()
