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
            if (len(value) > 140):
                return False
        elif isinstance(value, int):
            if (value < -1000) or (value >= 65536):
                return False
        elif isinstance(value, type(None)):
            continue
        else:
            return False

def judgeIntValid(data):
    if isinstance(data, int):
        return (data >= -1000) and (data < 65536)
    else:
        return False


SQL_DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

