import 'jest-enzyme';
import {
    formatTask,
    isNumericAttr,
    errorMessages,
    checkTimeValid,
    judgeInputError,
    judgeStartTimerError,
    getDefaultTimer,
} from "../timer-form-utilities"
import {formatDate, formatTime} from "../utilities";

describe("Timer form utilities tests", function () {

    it("Is numeric Attribute test", function () {
        expect(isNumericAttr("duration")).toEqual(true)
        expect(isNumericAttr("breakTime")).toEqual(true)
        expect(isNumericAttr("round")).toEqual(true)
        expect(isNumericAttr("justAnotherAttr")).toEqual(false)
    })

    it("Error message test", function () {
        expect(errorMessages('empty', "justAnotherAttr")).toEqual("justAnotherAttr can not be empty!")
        expect(errorMessages("non-positive number", "justAnotherAttr")).toEqual("justAnotherAttr value can not be negative!")
        expect(errorMessages("wrong time", "justAnotherAttr")).toEqual("Start time can not be later than current time!")
        expect(errorMessages("wrong date format", "justAnotherAttr")).toEqual("justAnotherAttr format error")
        expect(errorMessages("numeric error", "justAnotherAttr")).toEqual("justAnotherAttr must be number value")
        expect(errorMessages("justAnotherError", "justAnotherAttr")).toEqual("Error!")
    })

    it("Check time valid test", function () {
        expect(checkTimeValid("Random string")).toEqual(false)
        expect(checkTimeValid("Random:str:ing")).toEqual(false)
        expect(checkTimeValid("Random:30")).toEqual(false)
        expect(checkTimeValid("Random:string")).toEqual(false)
        expect(checkTimeValid("30:05")).toEqual(false)
        expect(checkTimeValid("19:-1")).toEqual(false)
        expect(checkTimeValid("19:05")).toEqual(true)
    })

    it("Judge Input No Error test", function () {
        expect(judgeInputError("justAnotherAttr", "justAnotherValue")).toEqual({})
        expect(judgeInputError("description", "")).toEqual({})
        expect(judgeInputError("duration", "15")).toEqual({})
    })

    it("Judge Input Empty Error test", function () {
        expect(judgeInputError("justAnotherAttr", "")).toEqual({
            "justAnotherAttr": "justAnotherAttr can not be empty!"
        })
    })

    it("Judge Input numeric Error test", function () {
        expect(judgeInputError("duration", "NotANumber")).toEqual({
            "duration": "duration must be number value"
        })
    })

    it("Judge Input non-positive Error test", function () {
        expect(judgeInputError("duration", "-15")).toEqual({
            "duration": "duration value can not be negative!"
        })
    })

    it("Judge start timer empty date error test", function () {
        expect(judgeStartTimerError("date", "")).toEqual({
            "date": "date can not be empty!"
        })
    })

    it("Judge start timer not a date error test", function () {
        expect(judgeStartTimerError("date", "not a date")).toEqual({
            "date": "date format error"
        })
    })

    it("Judge start timer date earlier than current error test", function () {
        expect(judgeStartTimerError("date", "1969-10-26")).toEqual({
            "date": "Start time can not be later than current time!"
        })
    })

    it("Judge start timer time empty error test", function () {
        expect(judgeStartTimerError("time", "")).toEqual({
            "time": "time can not be empty!"
        })
    })

    it("Judge start timer time invalid error test", function () {
        expect(judgeStartTimerError("time", "", "20:91")).toEqual({
            "time": "time format error"
        })
    })

    it("Judge start timer wrong time error test", function () {
        let date = formatDate(new Date())
        let time = formatTime(new Date(new Date().getTime() - 15 * 60000))
        expect(judgeStartTimerError("time", date, time, {})).toEqual({
            "time": "Start time can not be later than current time!"
        })
    })

    it("Judge start timer no date error test", function (){
        expect(judgeStartTimerError("date", "2051-10-26")).toEqual({})
    })


    it("Judge start timer no time error test", function () {
        let date = formatDate(new Date())
        let time = formatTime(new Date(new Date().getTime() + 15 * 60000))
        expect(judgeStartTimerError("time", date, time, {})).toEqual({})
    })

    it("Get default timer test", function () {
        expect(getDefaultTimer()).toEqual({
            'title': 'new timer',
            'description': '',
            'breakTime': 5,
            'duration': 25,
            'round': 1,
            'date': minDate,
            'time': minTime,
        })
    })
})