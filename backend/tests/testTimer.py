#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for timers
"""
import unittest
from tests.testCase import TestCase
from app.models import Timer


class TestTimers(TestCase):
    """Class to test timers"""
    def testCreateTimers(self):
        """test create timers"""
        appResponse = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 1,
                                           "startTime": "2020-11-22T04:01:00.000Z",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        jsonData = appResponse.get_json()
        appResponse2 = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 1,
                                           "startTime": "2020-11-22T04:01:00.000Z",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        jsonData2 = appResponse2.get_json()
        appResponse3 = self.testApp.post('/timers/', json={"breakTime": 5,
                                           "description": "this is a test timer",
                                           "duration": 25, "id": 1, "round": 2,
                                           "startTime": "2020-11-22T04:00:00.000Z",
                                           "title": "test timer", "userId": "10000", "zoomLink": ""
        })
        jsonData3 = appResponse3.get_json()
        self.assertEqual(jsonData['code'], 201)
        self.assertEqual(jsonData2['code'], 403)
        self.assertEqual(jsonData3['code'], 403)

    def testCreateTimers2(self):
        """test to create timers without required parameters"""
        appResponse = self.testApp.post('/timers/')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)


    def testGetTimers(self):
        """test to get a timer by id"""
        appResponse = self.testApp.get('/timers/?timerId=9')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 200)



    def testGetTimers2(self):
        """test to retrieve a non-existing timer"""
        appResponse = self.testApp.get('/timers/?timerId=1000')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 404)

    def testGetTimers3(self):
        """test to retrieve a timer by a user id """
        appResponse = self.testApp.get('/timers/?userId=117310065298163219549')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testGetTimers4(self):
        """test to retrieve a timer by non-existing a userid"""
        appResponse = self.testApp.get('/timers/?userId=100')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 404)

    def testGetTimers5(self):
        """test to retrieve timers without required parameters"""
        appResponse = self.testApp.get('/timers/')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testUpdateTimers(self):
        """test to update a timer"""
        appResponse = self.testApp.put('/timers/9', json={"breakTime": 15})
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testUpdateTimers2(self):
        """test to update a non-existing timer"""
        appResponse = self.testApp.put('/timers/999', json={"breakTime": 15})
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 404)

    def testUpdateTimers3(self):
        """test to update a timer without required parameters"""
        appResponse = self.testApp.put('/timers/9')
        jsonData = appResponse.get_json()
        # print(jsonData)
        self.assertEqual(jsonData['code'], 400)

    def testDeleteTimers(self):
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

    def testDeleteTimers2(self):
        """test to delete a non-existing timer"""
        appResponse2 = self.testApp.delete('/timers/1500')
        jsonData = appResponse2.get_json()
        self.assertEqual(jsonData['code'], 404)

    def testToDict(self):
        '''test the function to transfer a model to a dicionary'''
        userId = 1
        title = "test"
        description = "test"
        zoomLink = ""
        startTime = ""
        duration = 25
        breakTime = 5
        round = 1
        newTimer = Timer(userId=str(userId),
                         title=str(title),
                         description=str(description),
                         zoomLink=str(zoomLink),
                         startTime=str(startTime),
                         duration=str(duration),
                         breakTime=str(breakTime),
                         round=str(round))
        result = newTimer.toDict()
        expectedResult = {'id': None,
                          'userId': '1',
                          'title': 'test',
                          'description': 'test',
                          'zoomLink': '',
                          'startTime': '',
                          'duration': '25',
                          'breakTime': '5',
                          'round': '1'}
        self.assertEqual(result,expectedResult)

    def testUpdate(self):
        """test the model function to update the timer"""
        userId = 1
        title = "test"
        description = "test"
        zoomLink = ""
        startTime = ""
        duration = 25
        breakTime = 5
        round = 1
        newTimer = Timer(userId=str(userId),
                         title=str(title),
                         description=str(description),
                         zoomLink=str(zoomLink),
                         startTime=str(startTime),
                         duration=str(duration),
                         breakTime=str(breakTime), round=str(round))
        data = {'id': None,
                'userId': '2',
                'title': 'test2',
                'description': 'test2',
                'zoomLink': '',
                'startTime': '',
                'duration': '30',
                'breakTime': '10',
                'round': '2'}
        newTimer.update(data)
        self.assertEqual(data,newTimer.toDict())






if __name__ == '__main__':
    unittest.main()
