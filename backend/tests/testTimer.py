#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for relations between tasks and timers
"""
from tests.TestCase import TestCase
from app.models import Timer
import unittest


class TestTimers(TestCase):
    def testCreateTimers(self):
        rv = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 1,
                                           "startTime": "2020-11-12 21:05:19",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        json_data = rv.get_json()
        rv2 = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 1,
                                           "startTime": "2020-11-12 21:05:19",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        json_data2 = rv2.get_json()
        rv3 = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 2,
                                           "startTime": "2020-11-12 21:04:19",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        json_data3 = rv3.get_json()
        self.assertEqual(json_data['code'], 201)
        self.assertEqual(json_data2['code'], 403)
        self.assertEqual(json_data3['code'], 403)
    def testCreateTimers2(self):
        rv = self.testApp.post('/timers/')
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 400)


    def testGetTimers(self):
        rv = self.testApp.get('/timers/?timerId=1')
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 200)



    def testGetTimers2(self):
        rv = self.testApp.get('/timers/?timerId=1000')
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 404)

    def testGetTimers3(self):
        rv = self.testApp.get('/timers/?userId=0')
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 200)

    def testGetTimers4(self):
        rv = self.testApp.get('/timers/?userId=100')
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 404)

    def testGetTimers5(self):
        rv = self.testApp.get('/timers/')
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 400)

    def testUpdateTimers(self):
        rv = self.testApp.put('/timers/1', json={"breakTime": 15})
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 200)

    def testUpdateTimers2(self):
        rv = self.testApp.put('/timers/999', json={"breakTime": 15})
        json_data = rv.get_json()
        self.assertEqual(json_data['code'], 404)

    def testUpdateTimers3(self):
        rv = self.testApp.put('/timers/1')
        json_data = rv.get_json()
        # print(json_data)
        self.assertEqual(json_data['code'], 400)

    def testDeleteTimers(self):
        rv1 = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "round": 1,
                                           "startTime": "Thu, 12 Nov 2020 21:05:19 GMT",
                                           "title": "test timer", "userId": "99", "zoomLink": ""
        })
        json_data = rv1.get_json()
        id = json_data['data']['id']
        rv2 = self.testApp.delete('/timers/%s' %id)
        json_data = rv2.get_json()
        self.assertEqual(json_data['code'], 200)

    def testDeleteTimers2(self):
        rv2 = self.testApp.delete('/timers/1500')
        json_data = rv2.get_json()
        self.assertEqual(json_data['code'], 404)

    def testToDict(self):
        userId = 1
        title = "test"
        description = "test"
        zoomLink = ""
        startTime = ""
        duration = 25
        breakTime = 5
        round = 1
        newTimer = Timer(userId=str(userId), title=str(title), description=str(description), zoomLink=str(zoomLink),
                         startTime=str(startTime),
                         duration=str(duration), breakTime=str(breakTime), round=str(round))
        result = newTimer.toDict()
        expectedResult = {'id': None, 'userId': '1',
                          'title': 'test', 'description': 'test',
                          'zoomLink': '', 'startTime': '',
                          'duration': '25', 'breakTime': '5', 'round': '1'}
        self.assertEqual(result,expectedResult)

    def testUpdate(self):
        userId = 1
        title = "test"
        description = "test"
        zoomLink = ""
        startTime = ""
        duration = 25
        breakTime = 5
        round = 1
        newTimer = Timer(userId=str(userId), title=str(title), description=str(description), zoomLink=str(zoomLink),
                         startTime=str(startTime),
                         duration=str(duration), breakTime=str(breakTime), round=str(round))
        data = {'id': None, 'userId': '2',
                          'title': 'test2', 'description': 'test2',
                          'zoomLink': '', 'startTime': '',
                          'duration': '30', 'breakTime': '10', 'round': '2'}
        newTimer.update(data)
        self.assertEqual(data,newTimer.toDict())






if __name__ == '__main__':
    unittest.main()
