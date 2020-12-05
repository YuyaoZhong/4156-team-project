import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import AllTaskLists from '../task-list';
import {TaskListArea} from '../task-list';
import TaskDiv from "../task-div";
import NewTaskListCard from "../new-tasklist-card";


configure({ adapter: new Adapter() });

describe("test <AllTaskLists/>", () => {
    // mockTaskList;
    let wrapper;
    const baseTasks = [
    {
        id: -1,
        name: "Test Task 1",
        status: 0,
        taskListId: 0,
        userId: "0"
    },
    ]

    const baseTaskLists = [
   {
    id: -1,
    name: "Test TaskList 1",
    userId: "0"
   },
   {
    id: -2,
    name: "Test TaskList 2",
    userId: "0"
   }
   ]
    it("test show loading ", () => {
        wrapper = mount(<DataContext.Provider value = {{
            tasks: baseTasks,
            tasklists: baseTaskLists,
            loading: true
         }}
        >
            <AllTaskLists/>
        </DataContext.Provider>);
        const isLoading = 'h1';
        expect(wrapper.exists({as: isLoading})).toEqual(false);
    });

    it("test normal mode ", () => {
        wrapper = mount(<DataContext.Provider value = {{
            tasks: baseTasks,
            tasklists: baseTaskLists,
            loading: false
         }}
        >
            <AllTaskLists/>
        </DataContext.Provider>);
        const isAdd = 'plus';
        expect(wrapper.find({name: isAdd}).length).toEqual(4);
    });

    it("test normal null mode ", () => {
        wrapper = mount(<DataContext.Provider value = {{
            loading: false
         }}
        >
            <AllTaskLists/>
        </DataContext.Provider>);
        const isAdd = 'plus';
        expect(wrapper.find({name: isAdd}).length).toEqual(2);
    });

    it("test add mode ", () => {
        wrapper = mount(<DataContext.Provider value = {{
            tasks: baseTasks,
            tasklists: baseTaskLists,
            loading: false
         }}
        >
            <AllTaskLists/>
        </DataContext.Provider>);
        const addButton = 'black';
        wrapper.find({color:addButton}).at(0).simulate('click');
        wrapper.update()
        const isAdd = 'plus';
        expect(wrapper.find({name: isAdd}).length).toEqual(3);
    });

    it("test close add mode ", () => {
        wrapper = mount(<DataContext.Provider value = {{
            tasks: baseTasks,
            tasklists: baseTaskLists,
            loading: false
         }}
        >
            <AllTaskLists/>
        </DataContext.Provider>);
        const addButton = 'black';
        wrapper.find({color:addButton}).at(0).simulate('click');
        wrapper.update();
        wrapper.find({floated: "right", type:"button"}).at(0).simulate('click');
        wrapper.update();
        expect(wrapper.find({floated: "right", type:"button"}).length).toEqual(0);
    });
});


describe("test <TaskListArea/>", () => {
    // mockTaskListArea;
    let wrapper;
    let handleDeleteTask;
    const baseTasks = [
    {
        id: -1,
        name: "Test Task 1",
        status: 0,
        taskListId: 0,
        userId: "0"
    },
    ]

    const baseTaskLists = [
   {
    id: -1,
    name: "Test TaskList 1",
    userId: "0"
   },
   {
    id: -2,
    name: "Test TaskList 2",
    userId: "0"
   }
   ]
    beforeEach(() => {
        handleDeleteTask = jest.fn();
    });

    it("test taskListArea ", async () => {

        wrapper = mount(<DataContext.Provider value = {{
            handleDeleteTask: handleDeleteTask,
         }}>
            <TaskListArea curTaskLists = {baseTaskLists} hideEdit = {false} />
        </DataContext.Provider>);
        expect(wrapper.find({name: "trash alternate"}).length).toEqual(2);
    });
});
