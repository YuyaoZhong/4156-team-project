#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for timers
"""
import unittest
from tests.testCase import TestCase
from app.models import TimerToUser


class TestTimers(TestCase):
    """Class to test timers"""
    def testCreateTimersToUser(self):
        """test to create timerToUser without required parameters"""
        appResponse = self.testApp.post('/timerToUser/')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testCreateTimersToUser2(self):
        """test to create timerToUser"""
        appResponse = self.testApp.post('/timerToUser/', json={"userId": 1,
                                                               "timerId": -200,
                                                               "status": 0
        })
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 201)

    def testGetTimerToUser(self):
        """test to get a timer by timerId"""
        appResponse = self.testApp.get('/timerToUser/?timerId=104')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testGetTimerToUser2(self):
        """test to get a timer by invalid timerId"""
        appResponse = self.testApp.get('/timerToUser/?timerId=-1')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 404)

    def testGetTimerToUser3(self):
        """test to get a timer by userId"""
        appResponse = self.testApp.get('/timerToUser/?userId=105308008508442350021')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testGetTimerToUser4(self):
        """test to get a timer by invalid userId"""
        appResponse = self.testApp.get('/timerToUser/?userId=999')
        jsonData = appResponse.get_json()
        print(jsonData)
        self.assertEqual(jsonData['code'], 404)

    def testGetTimerToUser5(self):
        """test to get a timer by userId and timerId"""
        appResponse = self.testApp.get('/timerToUser/?userId=0&timerId=-200')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testGetTimerToUser6(self):
        """test to get a timer by invalid userId and invalid timerId"""
        appResponse = self.testApp.get('/timerToUser/?userId=999&timerId=999')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 404)

    def testGetTimerToUser7(self):
        """test to get a timer by invalid input"""
        appResponse = self.testApp.get('/timerToUser/')
        jsonData = appResponse.get_json()
        self.assertEqual(jsonData['code'], 400)

    def testDeleteTimers(self):
        """test to delete timerToUser"""
        appResponse1 = self.testApp.delete('/timerToUser/84/89')
        jsonData = appResponse1.get_json()
        self.assertEqual(jsonData['code'], 200)

    def testDeleteTimers2(self):
        """test to delete timerToUser with invalid input"""
        appResponse1 = self.testApp.delete('/timerToUser/1000/1000')
        jsonData = appResponse1.get_json()
        self.assertEqual(jsonData['code'], 404)






if __name__ == '__main__':
    unittest.main()
