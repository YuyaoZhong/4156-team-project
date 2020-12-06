import 'jest-enzyme';
import {formatTime, getcurRound, inBreak, getTimeLeft, getSharingUrl, getTimerId} from "../timer-utilities";
import {CLIENT_URL} from "../../constants/constants";

describe("Timer utilities tests", function () {
    it ("Timer left more than 10 hours test", function (){
        expect(formatTime(36005)).toEqual("10:00:05")
    })

    it ("Timer left more than an hour test", function (){
        expect(formatTime(3605)).toEqual("01:00:05")
    })

    it ("Timer left less than an hour test", function (){
        expect(formatTime(648)).toEqual("10:48")
    })

    it ("Get current round (out of bounds in loop) test", function (){
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 105 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }

        expect(getcurRound(timer)).toEqual(-1)

    })

    it ("Get current round (out of bounds) test", function (){
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 35 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }

        expect(getcurRound(timer)).toEqual(-1)

    })
    
    

    it ("Get current round test", function (){
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 15 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }

        expect(getcurRound(timer)).toEqual(1)

    })
    
    it ("In break (out of bounds) test", function () {
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 65 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }
        
        expect(inBreak(timer, getcurRound(timer))).toEqual(false)
    })
        
    it ("In break (out of bounds) test", function () {
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 65 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }
        
        expect(inBreak(timer, getcurRound(timer))).toEqual(false)
    })

    it ("In break test", function () {
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 27 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }

        expect(inBreak(timer, getcurRound(timer))).toEqual(true)
    })

    it ("Not in break test", function () {
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 10 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }

        expect(inBreak(timer, getcurRound(timer))).toEqual(false)
    })

    it("Get time left (oob) test", function () {
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 65 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }

        expect(getTimeLeft(timer, getcurRound(timer), inBreak(timer, getcurRound(timer)))).toEqual(0)
    })

    it("Get time left (not in break) test", function () {
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 10 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }

        expect(getTimeLeft(timer, getcurRound(timer), inBreak(timer, getcurRound(timer)))).toEqual(900)
    })

    it("Get time left (in break) test", function () {
        let timer = {
            breakTime: 5,
            description: "",
            duration: 25,
            id: -4,
            isCreator: false,
            round: 1,
            startTime: new Date(new Date().getTime() - 28 * 60000).toISOString(),
            timerToUserId: "0",
            title: "test timer",
            userId: "-1",
            zoomLink: "None"
        }

        expect(getTimeLeft(timer, getcurRound(timer), inBreak(timer, getcurRound(timer)))).toEqual(120)
    })

    it("Get sharing url test", function () {
        const sharingUrl = `${CLIENT_URL}/timer/${btoa("timerId=15&creator=200000")}`
        expect(getSharingUrl(15,200000)).toEqual(sharingUrl)
    })

    it("Get timer ID (invalid) test 0", function () {
        expect(getTimerId("randomGarbage")).toEqual(-1)
    })

    it("Get timer ID (invalid) test 1", function () {
        expect(getTimerId(btoa("hello=0"))).toEqual(-1)
    })

    it("Get timer ID (invalid) test 2", function () {
        expect(getTimerId(btoa("hello"))).toEqual(-1)
    })

    it("Get timer ID (invalid) test 3", function () {
        expect(getTimerId(btoa("hel=lo=0"))).toEqual(-1)
    })

    it("Get timer ID (encoded) test", function () {
        expect(getTimerId(btoa("timerId=1648"))).toEqual(1648)
    })

    it("Get timer ID test", function () {
        expect(getTimerId("1648")).toEqual(1648)
    })



})