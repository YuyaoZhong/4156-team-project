import 'jest-enzyme';
import {upsertData, deleteData} from "../apiMethods";
import {SERVER_URL} from "../../constants/constants";

describe("Api Methods Tests", function () {
    it("Upsert Data test", function () {
        let route = `${SERVER_URL}/tasklists/`
        let body = {
            name: "test task list",
            userId: -1,
        }
        let ans = fetch(route, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }).then(r=>r.json())
        expect(upsertData(route, body, "POST")).toEqual(ans)
    })

    it("Upsert Data test", function () {
        let route = `${SERVER_URL}/tasklists/1`
        let ans = fetch(route, {
            method: 'DELETE',
            mode: 'cors'
        }).then(r=>r.json())
        expect(deleteData(route)).toEqual(ans)
    })

})