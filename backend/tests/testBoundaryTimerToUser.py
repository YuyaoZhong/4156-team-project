#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for timers
"""
import unittest
from tests.testCase import TestCase
from app.models import TimerToUser


class TestTimersBoundary(TestCase):
    """Class to test timers"""

    def testCreateTimersToUserValid(self):
        """test to create timerToUser"""
        appResponse = self.testApp.post('/timerToUser/', json={"userId": 1,
                                                               "timerId": -200,
                                                               "status": 0
        })
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 201)

    def testCreateTimersToUserInvalid(self):
        """test to create timerToUser"""
        appResponse = self.testApp.post('/timerToUser/', json={"userId": 1,
                                                               "timerId": 100000,
                                                               "status": 0
        })
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testCreateTimersToUserBoundary(self):
        """test to create timerToUser"""
        appResponse = self.testApp.post('/timerToUser/', json={"userId": 1,
                                                               "timerId": 65535,
                                                               "status": 0
        })
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 500)

    def testGetTimerToUserValid(self):
        """test to get a timer by timerId"""
        appResponse = self.testApp.get('/timerToUser/?timerId=104')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testGetTimerToUserInvalid(self):
        """test to get a timer by timerId"""
        appResponse = self.testApp.get('/timerToUser/?timerId=100000')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testGetTimerToUserInvalid2(self):
        """test to get a timer by userId and timerId"""
        appResponse = self.testApp.get('/timerToUser/?userId=0&timerId=-2000')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)


    def testGetTimerToUserBoundary(self):
        """test to get a timer by timerId"""
        appResponse = self.testApp.get('/timerToUser/?timerId=65535')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 404)

    def testDeleteTimersValid(self):
        """test to delete timerToUser"""
        appResponse1 = self.testApp.delete('/timerToUser/84/89')
        jsonData = appResponse1.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testDeleteTimersInvalid(self):
        """test to delete timerToUser"""
        appResponse1 = self.testApp.delete('/timerToUser/100000/89')
        jsonData = appResponse1.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testDeleteTimersBoundary(self):
        """test to delete timerToUser"""
        appResponse1 = self.testApp.delete('/timerToUser/65535/89')
        jsonData = appResponse1.get_json()
        self.assertEqual(jsonData['code'], 404)



if __name__ == '__main__':
    unittest.main()
