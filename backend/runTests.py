#!/user/bin/python3
# -*- coding: utf-8 -*-
import HtmlTestRunner
import os
import unittest

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(PROJECT_ROOT, 'test_reports')

def runTests():
    testSuite = unittest.TestSuite()
    testLoader = unittest.defaultTestLoader
    allTests = testLoader.discover('tests', '*.py')
    # Loop the tests
    for testCase in allTests:
        # print(test_case)
        testSuite.addTests(testCase)

    test_runner = HtmlTestRunner.HTMLTestRunner(output=OUTPUT_PATH)
    test_runner.run(testSuite)

if __name__ == "__main__":
    runTests()