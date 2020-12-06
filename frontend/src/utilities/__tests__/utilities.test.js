import 'jest-enzyme';
import {constructDate, formatDate, formatDateAndTime, formatTime, formatValueToBeInBoundary} from "../utilities";

describe("Utilities test", function() {
    it("Format date test", function () {
        let date = new Date(1970, 11, 2)
        expect(formatDate(date)).toEqual("1970-12-02")
    })

    it("Format time test", function () {
        let date = new Date(1970, 10, 2, 12, 45)
        expect(formatTime(date)).toEqual("12:45")
    })

    it("Construct date test", function () {

        let date = new Date(1970, 10, 2, 12, 45)
        expect(constructDate("1970-11-02 12:45")).toEqual(date)
    })


    it("Format date and time test", function () {
        let date = new Date(1970, 10, 2, 12, 45)
        expect(formatDateAndTime(date)).toEqual("1970-11-02 12:45")
    })

    it("format string to be in boundary test", function () {
        const a = "a";
        expect(formatValueToBeInBoundary(a.repeat(15))).toEqual(a.repeat(15))
    })

    it("format out-of-bounds string to be in boundary test", function () {
        const a = "a";
        expect(formatValueToBeInBoundary(a.repeat(150))).toEqual(a.repeat(140))
    })

    it("format number to be in boundary test", function () {
        expect(formatValueToBeInBoundary(590)).toEqual(590)
    })

    it("format out-of-bounds number to be in boundary test", function () {
        expect(formatValueToBeInBoundary(100000)).toEqual(65535)
    })

    it("format other type to be in boundary test", function (){
        expect(formatValueToBeInBoundary(2 === 2)).toEqual(true)
    })

})
