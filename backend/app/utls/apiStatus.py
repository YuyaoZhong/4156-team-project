#!/user/bin/python3
# -*- coding: utf-8 -*-

class APIStatus:
    """Class to Unify response code and message"""
    def __init__(self):
        self.messageDict = {
            200: "Request succeed",
            201: "Successfully create",
            400: "Missing required attributes",
            401: "Unauthorized with wrong user id",
            403: "Forbidden",
            404: "Requested data not found",
            500: "Internal server error"

        }

    def getResponseMsg(self, code, msg = ""):
        """function to Unify response code and message"""
        if code not in self.messageDict and msg != "" and len(msg) > 0:
            self.messageDict[code] = msg

        if code in self.messageDict:
            msg = self.messageDict[code]
        else:
            msg = "Request Error"

        return msg

apiStatus = APIStatus()
