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
import TasklistCard from '../tasklist-card';


configure({ adapter: new Adapter() });

describe("test <TasklistCard/>", () => {
    // mockTaskListArea;
    let wrapper;
    let handleDeleteTaskList;
    const baseTasks = [
    {
        id: -1,
        name: "Test Task 1",
        status: 0,
        taskListId: 0,
        userId: "0"
    },
    ]

    const baseTaskList =
   {
    id: -1,
    name: "Test TaskList 1",
    userId: "0",
    tasks: [
            {
        id: -1,
        name: "Test Task 1",
        status: 0,
        taskListId: 0,
        userId: "0"
    }
    ]
   }

       const baseTaskList2 =
   {
    id: -1,
    name: "Test TaskList 1",
    userId: "0",
   }


    beforeEach(() => {
        handleDeleteTaskList = jest.fn();
    });

    it("test hideEdit true ", async () => {

        wrapper = mount(<DataContext.Provider value = {{
            handleDeleteTaskList: handleDeleteTaskList,
         }}>
            <TasklistCard tasklist = {baseTaskList2} hideEdit = {true} />
        </DataContext.Provider>);
        expect(wrapper.find({name: "trash alternate"}).length).toEqual(0);
    });

    it("test hideEdit false ", async () => {

        wrapper = mount(<DataContext.Provider value = {{
            handleDeleteTaskList: handleDeleteTaskList,
         }}>
            <TasklistCard tasklist = {baseTaskList} hideEdit = {false} />
        </DataContext.Provider>);
        expect(wrapper.find({name: "trash alternate"}).length).toEqual(1);
    });

    it("test delete tasklist ", async () => {

        wrapper = mount(<DataContext.Provider value = {{
            handleDeleteTaskList: handleDeleteTaskList,
         }}>
            <TasklistCard tasklist = {baseTaskList} hideEdit = {false} />
        </DataContext.Provider>);
        const debug = wrapper.find({color:'grey', floated:'right'}).at(0).find({className:"hidden content"}).at(0).simulate('click');
        expect(handleDeleteTaskList).toHaveBeenCalled();
    });

    it("test handleAddTaskMode ", async () => {

        wrapper = mount(<DataContext.Provider value = {{
            handleDeleteTaskList: handleDeleteTaskList,
         }}>
            <TasklistCard tasklist = {baseTaskList} hideEdit = {false} />
        </DataContext.Provider>);
        const debug = wrapper.find({color:'grey'}).at(1).simulate('click');
        wrapper.update();
        expect(wrapper.find({color:'grey'}).length).toEqual(1);
    });

    it("test closeAddTaskMode ", async () => {

        wrapper = mount(<DataContext.Provider value = {{
            handleDeleteTaskList: handleDeleteTaskList,
         }}>
            <TasklistCard tasklist = {baseTaskList} hideEdit = {false} />
        </DataContext.Provider>);
        wrapper.find({color:'grey'}).at(1).simulate('click');
        wrapper.update();
        wrapper.find({className:"ui secondary button"}).at(0).simulate('click');
        wrapper.update();
        // console.log(debug.debug())
        expect(wrapper.find({color:'grey'}).length).toEqual(2);
    });




});

