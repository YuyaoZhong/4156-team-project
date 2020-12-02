""" Unit tests for zoom integration
"""

import unittest
from flask import json
from tests.testCase import TestCase


class TestZoom(unittest.TestCase):
    def testZoomIntegration(self):
        """ Test to successfully create a meeting based on provided timer ID """
        response = self.testApp.put('/zoom' +
                                    '?code=MKdPJy49zC_PuUng-ySRZiNHsNYmaTNbg' +
                                    '?state=' + "sampleTimerId")
        r = response.get_json()
        self.assertTrue(r['code'] == 200)
        self.assertTrue('start_url' in r)
        self.assertTrue('join_url' in r)


    def testZoomIntegrationInvalidOAuth(self):
        """ Test to create a meeting with invalid OAuth code """
        response = self.testApp.put('/zoom' +
                                    '?code=0' +
                                    '?state=0')
        r = response.get_json()
        self.assertFalse(r['code'] == 200)
        self.assertFalse(r['code'] == 201)

    def testZoomIntegrationInvalidTimer(self):
        """ Test to create a meeting with invalid OAuth code """
        response = self.testApp.put('/zoom' +
                                    '?code=MKdPJy49zC_PuUng-ySRZiNHsNYmaTNbg' +
                                    '?state=0')
        r = response.get_json()
        self.assertFalse(r['code'] == 200)
        self.assertFalse(r['code'] == 201)


if __name__ == '__main__':
    unittest.main()
