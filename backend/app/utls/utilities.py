#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Helper functions for implement app
"""

def judgeKeysExist(data, attrs):
    for attr in attrs:
        if attr not in data:
            return False
    return True

def judgeKeysCorrect(data, attrs):
    for key, value in data.items():
        if key not in attrs:
            return False
    return True

