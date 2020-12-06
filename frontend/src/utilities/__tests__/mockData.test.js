import 'jest-enzyme';
import {genStr} from "../mockData";

describe("tests for functions in mock data" , function () {
    it("generate string test", function() {
        expect(genStr(50)).toEqual("a".repeat(50))
    })
})