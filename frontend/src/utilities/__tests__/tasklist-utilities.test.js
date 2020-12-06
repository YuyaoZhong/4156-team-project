import 'jest-enzyme';
import {matchedTaskLists} from "../tasklist-utilities";

describe("Tasklist utilities tests", function () {
    it("matched tasklist test", function () {

        let taskArray =  [
            {
                id: -1,
                name: "Test Task 1",
                status: 0,
                taskListId: 0,
                userId: "0"
            },
            {
                id: -2,
                name: "Test Task 2",
                status: 0,
                taskListId: 1,
                userId: "0"
            },
        ]

        let taskListArray = [
            {
                id: 1,
                name: "Test Task list"
            }
        ]
        expect(matchedTaskLists(taskArray, taskListArray)).toEqual([
            {
                id: 0,
                name: "Default",
                tasks: [
                    {
                        id: -1,
                        name: "Test Task 1",
                        status: 0,
                        taskListId: 0,
                        userId: "0"
                    },
                ]
            },

            {
                id: 1,
                name: "Test Task list",
                tasks: [
                    {
                        id: -2,
                        name: "Test Task 2",
                        status: 0,
                        taskListId: 1,
                        userId: "0"
                    },
                ]
            }
        ])
    })
})