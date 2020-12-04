import React from 'react'
import Enzyme, { shallow, mount} from 'enzyme'
// Configure enzyme for react 16
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

import EditTaskDiv from '../edit-task-div';
import { DataContext} from '../../../context/data-context';

describe("handleChange", () => {
    let mockHandleClose;
    let wrapper;

    beforeEach(() => {
        mockHandleClose = jest.fn();
        wrapper = mount(<DataContext.Provider value = {{
            handleUpsertTask: jest.fn()
         }}
        >
            <EditTaskDiv closeAddTaskMode={mockHandleClose}/>
        </DataContext.Provider>)
        // wrapper = shallow(<EditTaskDiv closeAddTaskMode={mockHandleClose}/>);
      });

    it("should call setState on input of task name", async () => {
   
       
       const testName = "Test Task";
       wrapper.find('input[name="task name"]').simulate('change', {
           target:{ 
               value: testName
           }
       });

       expect(wrapper.find('input[name="task name"]').prop('value')).toEqual(testName);
    });
  });