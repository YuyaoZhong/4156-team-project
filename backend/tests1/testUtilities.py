#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for utility functions
"""
import unittest
from app.utls.apiStatus import APIStatus
from app.utls.utilities import judgeKeysCorrect, judgeKeysExist
from app.utls.utilities import judgeInputValid
from app.utls.utilities import judgeIntValid

class TestCasesForUtilities(unittest.TestCase):
    """Class to test the helper functions"""
    def testJudgeKeyExist(self):
        """test the utility function to judge whether key exists"""
        data = {'test':1}
        attrs = ['test']
        result = judgeKeysExist(data,attrs)
        self.assertEqual(result,True)

    def testJudgeKeyExist2(self):
        """test the utility function to judge a key that does not exist"""
        data = None
        attrs = ['test']
        result = judgeKeysExist(data,attrs)
        self.assertEqual(result,False)

    def testJudgeKeyExist3(self):
        """test the utility function to judge a key not exist"""
        data = {'test':1}
        attrs = ['test', 'test2']
        result = judgeKeysExist(data,attrs)
        self.assertEqual(result,False)

    def testJudgeKeyCorrect(self):
        """test the utility function to judge whether a key is correct"""
        data = {'test2':1}
        attrs = ['test']
        result = judgeKeysCorrect(data,attrs)
        self.assertEqual(result,False)

    def testJudgeKeyCorrect2(self):
        """test the utility function to judge an incorrect key"""
        data = None
        attrs = ['test']
        result = judgeKeysCorrect(data,attrs)
        self.assertEqual(result,False)

    def testJudgeKeyCorrect3(self):
        """test the utility function to judge whether a key is correct"""
        data = {'test':1}
        attrs = ['test', 'test2']
        result = judgeKeysCorrect(data,attrs)
        self.assertEqual(result,True)

    def testApiStatus(self):
        """test the apiStatus class"""
        testApi = APIStatus()
        result = testApi.getResponseMsg(300,"test")
        self.assertEqual(result,"test")

    def testApiStatus2(self):
        """test the apiStatus class"""
        testApi = APIStatus()
        result = testApi.getResponseMsg(200,"test")
        self.assertEqual(result,"Request succeed")

    def testApiStatus3(self):
        """test the apiStatus class"""
        testApi = APIStatus()
        result = testApi.getResponseMsg(600,"")
        self.assertEqual(result,"Request Error")

    def testJudgeKeyExist(self):
        """test the utility function to judge whether key exists"""
        data = {'test':1}
        attrs = ['test']
        result = judgeKeysExist(data,attrs)
        self.assertEqual(result,True)

    def testJudgeInputValidInt(self):
        """test the utility function to judge whether input is valid"""
        data = {'key': 1}
        result = judgeInputValid(data)
        self.assertEqual(result, True)

    def testJudgeInputValidString(self):
        """test the utility function to judge whether input is valid"""
        data = {'key': 'testString'}
        result = judgeInputValid(data)
        self.assertEqual(result, True)

    def testJudgeInputValidIntegerSmall(self):
        """test the utility function to judge whether int is too small"""
        data = {'key': -1001}
        result = judgeInputValid(data)
        self.assertEqual(result, False)

    def testJudgeInputValidIntegerBig(self):
        """test the utility function to judge whether int is too small"""
        data = {'key': 65537}
        result = judgeInputValid(data)
        self.assertEqual(result, False)

    def testJudgeInputValidIntegerBound(self):
        """test the utility function to judge whether int is too small"""
        data = {'key': 65535}
        result = judgeInputValid(data)
        self.assertEqual(result, True)

    def testJudgeInputValidStringOver(self):
        """test the utility function to judge whether string is too long"""
        data = {'key': 'a'*141}
        result = judgeInputValid(data)
        self.assertEqual(result, False)

    def testJudgeInputNone(self):
        """test the utility function to judge whether int is too small"""
        data = {'key': None}
        result = judgeInputValid(data)
        self.assertEqual(result, True)

    def testJudgeInputEmpty(self):
        """test the utility function to judge whether int is too small"""
        data = ''
        result = judgeInputValid(data)
        self.assertEqual(result, False)

    def testJudgeInputNone(self):
        """test the utility function to judge whether int is too small"""
        data = {'key': [0]}
        result = judgeInputValid(data)
        self.assertEqual(result, False)

    def testJudgeInputCompositeValid(self):
        """test the utility function to judge whether int is too small"""
        data = {'key': None, 'key1': 1, 'key2': 65535, 'key3': -1000,
                'key4': 'testString'}
        result = judgeInputValid(data)
        self.assertEqual(result, True)

    def testJudgeInputCompositeInvalidInt(self):
        """test the utility function to judge whether int is too small"""
        data = {'key': None, 'key1': 1, 'key2': 65536, 'key3': -1000,
                'key4': 'testString'}
        result = judgeInputValid(data)
        self.assertEqual(result, False)

    def testJudgeInputCompositeInvalidString(self):
        """test the utility function to judge whether int is too small"""
        data = {'key': None, 'key1': 1, 'key2': 65535, 'key3': -1000,
                'key4': 'a'*141}
        result = judgeInputValid(data)
        self.assertEqual(result, False)

    def testJudgeIntValid(self):
        data = 1
        result = judgeIntValid(data)
        self.assertEqual(result, True)

    def testJudgeIntValidBoundary(self):
        data = 65535
        result = judgeIntValid(data)
        self.assertEqual(result, True)
        data = -1000
        result = judgeIntValid(data)
        self.assertEqual(result, True)

    def testJudgeIntValidBoundary(self):
        data = 65536
        result = judgeIntValid(data)
        self.assertEqual(result, False)
        data = -1001
        result = judgeIntValid(data)
        self.assertEqual(result, False)

if __name__ == '__main__':
    unittest.main()
