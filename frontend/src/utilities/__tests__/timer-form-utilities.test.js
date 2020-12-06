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

    
})