import 'jest-enzyme';
import {upsertData, deleteData} from "../apiMethods";
import {SERVER_URL} from "../../constants/constants";
import fetchMock from 'fetch-mock-jest';


describe("Api Methods Tests", function () {
    beforeEach(()=>{

        fetchMock.mockReset();
        fetchMock.post('*', {
            code: 201,
            message: 'success',
            data: {
                name: "test task list",
                userId: -1,
            }
        });
        fetchMock.put('*', {
            code: 201,
            message: 'success',
            data: {
                name: "test task list",
                userId: -1,
            }
        });
        fetchMock.delete('*', {
            code: 200,
            message: 'success',
            data: 'test delete'
        });

    });


    it("Upsert Data test",  async ()=> {
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
        await upsertData(route, body, "POST");
        expect(fetchMock).toHaveBeenCalled();
       
    })

    it("Upsert Data test", async () => {
        let route = `${SERVER_URL}/tasklists/1`
        let ans = fetch(route, {
            method: 'DELETE',
            mode: 'cors'
        }).then(r=>r.json())
        expect(deleteData(route)).toEqual(ans);
        await deleteData(route);
        expect(fetchMock).toHaveBeenCalled();
    })

})