""" Unit tests for zoom integration
"""

import unittest
import pprint
from tests.testCase import TestCase

# Need to manually get valid OAuths
VALID_OAUTH_0 = ""
VALID_OAUTH_1 = ""

class TestZoom(TestCase):
    def testZoomIntegration(self):
        """ Test to successfully create a meeting based on provided timer ID """
        response = self.testApp.put('/zoom' +
                                    '?code=' + VALID_OAUTH_0 +
                                    '&state=' + "38")
        r = response.get_json()
        print(r)
        self.assertTrue(r['code'] == 200)
        self.assertTrue('start_url' in r['data'])
        self.assertTrue('join_url' in r['data'])


    def testZoomIntegrationInvalidOAuth(self):
        """ Test to create a meeting with invalid OAuth code """
        response = self.testApp.put('/zoom' +
                                    '?code=0' +
                                    '&state=0')
        r = response.get_json()
        self.assertFalse(r['code'] == 200)
        self.assertFalse(r['code'] == 201)


    def testZoomIntegrationInvalidTimer(self):
        """ Test to create a meeting with invalid OAuth code """
        response = self.testApp.put('/zoom' +
                                    '?code=' + VALID_OAUTH_1 +
                                    '&state=0')
        r = response.get_json()
        self.assertFalse(r['code'] == 200)
        self.assertFalse(r['code'] == 201)


if __name__ == '__main__':
    unittest.main()
