import unittest
from app.utls.utilities import judgeKeysCorrect, judgeKeysExist


class TestCasesForUtilities(unittest.TestCase):
    def testJudgeKeyExist(self):
        data = {'test':1}
        attrs = ['test']
        result = judgeKeysExist(data,attrs)
        self.assertEqual(result,True)

    def testJudgeKeyExist2(self):
        data = None
        attrs = ['test']
        result = judgeKeysExist(data,attrs)
        self.assertEqual(result,False)

    def testJudgeKeyExist3(self):
        data = {'test':1}
        attrs = ['test', 'test2']
        result = judgeKeysExist(data,attrs)
        self.assertEqual(result,False)

    def testJudgeKeyCorrect(self):
        data = {'test2':1}
        attrs = ['test']
        result = judgeKeysCorrect(data,attrs)
        self.assertEqual(result,False)

    def testJudgeKeyCorrect2(self):
        data = None
        attrs = ['test']
        result = judgeKeysCorrect(data,attrs)
        self.assertEqual(result,False)

    def testJudgeKeyCorrect3(self):
        data = {'test':1}
        attrs = ['test', 'test2']
        result = judgeKeysCorrect(data,attrs)
        self.assertEqual(result,True)



if __name__ == '__main__':
    unittest.main()
