#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Unit tests for utility functions
"""
import unittest
from app.utls.utilities import judgeKeysCorrect, judgeKeysExist

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



if __name__ == '__main__':
    unittest.main()
