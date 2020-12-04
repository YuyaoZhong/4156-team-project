#!/user/bin/python3
# -*- coding: utf-8 -*-
"""Helper functions for implement app
"""

def judgeKeysExist(data, attrs):
    """check if all the required keys existed"""
    if not data:
        return False
    for attr in attrs:
        if attr not in data:
            return False
    return True

def judgeKeysCorrect(data, attrs):
    """check if all the keys valid"""
    if not data:
        return False
    for key, value in data.items():
        if key not in attrs:
            return False
    return True

def judgeInputValid(data):
    if not data:
        return False
    for key, value in data.items():
        if isinstance(value, str):
            return (len(value) <= 140)
        elif isinstance(value, int):
            return (value >= -1000) and (value < 65536)
        else:
            return False


SQL_DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

