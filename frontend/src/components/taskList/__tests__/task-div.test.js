import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import TaskDiv from '../task-div';

configure({ adapter: new Adapter() });

describe("test <TaskDiv/>", () => {
    // let mockTask;
    let wrapper;
    let handleUpsertTask;
    let handleDeleteTask;
    const baseTask = {
        name: "Test Task",
        taskListId: 0
    }
    const incompleteTask = {...baseTask, status: 0};
    const completeTask = {...baseTask, status: 1};

    beforeEach(() => {
        handleUpsertTask = jest.fn();
        handleDeleteTask = jest.fn();

      });

    it("test show an incomplete task ", async () => {
        wrapper = mount(<DataContext.Provider value = {{
            handleUpsertTask: handleUpsertTask,
            handleDeleteTask: handleDeleteTask,
         }}
        >
            <TaskDiv task = {incompleteTask} hideEdit = {false} />
        </DataContext.Provider>);

        const incompleteIconClass = 'square outline';
        expect(wrapper.exists({name: incompleteIconClass})).toEqual(true);

    });


    
    it("test show a complete task ", async () => {
        wrapper = mount(<DataContext.Provider value = {{
            handleUpsertTask: handleUpsertTask,
            handleDeleteTask: handleDeleteTask,
         }}
        >
            <TaskDiv task = {completeTask} hideEdit = {false} />
        </DataContext.Provider>);

        const completeIconClass = 'check square outline';
        expect(wrapper.exists({name: completeIconClass})).toEqual(true);

    });



    it("test hide delete button", async () => {
        wrapper = mount(<DataContext.Provider value = {{
            handleUpsertTask: handleUpsertTask,
            handleDeleteTask: handleDeleteTask,
         }}
        >
            <TaskDiv task = {incompleteTask} hideEdit = {true} />
        </DataContext.Provider>);

        const deleteIconClass = 'minus square';
        expect(wrapper.exists({name: deleteIconClass})).toEqual(false);

    });



    it("test change a task status, incomplete -> complete", async () => {
        wrapper = mount(<DataContext.Provider value = {{
            handleUpsertTask: handleUpsertTask,
            handleDeleteTask: handleDeleteTask,
         }}
        >
            <TaskDiv task = {incompleteTask} hideEdit = {false} />
        </DataContext.Provider>);

        const incompleteIconClass = 'square outline';
        wrapper.find({name:incompleteIconClass}).at(0).simulate('click');
        expect(handleUpsertTask).toHaveBeenCalled();

    });


    it("test delete a task", async () => {
        wrapper = mount(<DataContext.Provider value = {{
            handleUpsertTask: handleUpsertTask,
            handleDeleteTask: handleDeleteTask,
         }}
        >
            <TaskDiv task = {incompleteTask} hideEdit = {false} />
        </DataContext.Provider>);

        const deleteIconClass = 'minus square';
        wrapper.find({name:deleteIconClass}).at(0).simulate('click');
        expect(handleDeleteTask).toHaveBeenCalled();

    });
  

  });