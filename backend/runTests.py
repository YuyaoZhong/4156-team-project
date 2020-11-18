#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Automated python file to run all the tests and gernerate reports
"""
import os
import unittest
import HtmlTestRunner

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(PROJECT_ROOT, 'test_reports')

def runTests():
    """function to discover all the tests in the module and run the tests"""
    testSuite = unittest.TestSuite()
    testLoader = unittest.defaultTestLoader
    allTests = testLoader.discover('tests', '*.py')
    # Loop the tests
    for testCase in allTests:
        testSuite.addTests(testCase)

    testRunner = HtmlTestRunner.HTMLTestRunner(output=OUTPUT_PATH)
    testRunner.run(testSuite)

if __name__ == "__main__":
    runTests()
