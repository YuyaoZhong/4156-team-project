import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import EditTaskDiv from '../edit-task-div';
import { DataContext} from '../../../context/data-context';


configure({ adapter: new Adapter() });

describe("test <EditTaskDiv/>", () => {
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

    it("test an valid name", async () => {
       const testName = "Test Task";
       wrapper.find('input[name="task name"]').simulate('change', {
           target:{ 
               value: testName
           }
       });

       expect(wrapper.find('input[name="task name"]').prop('value')).toEqual(testName);
    });

    it("test a boundary name", async () => {
        let testBoundaryName = "";
        const boundarylength = 140;
        for(var i = 0; i < boundarylength; i++){
            testBoundaryName += "a";
        }

        expect(testBoundaryName.length).toEqual(boundarylength);

        wrapper.find('input[name="task name"]').simulate('change', {
            target:{ 
                value: testBoundaryName
            }
        });

        expect(wrapper.find('input[name="task name"]').prop('value')).toEqual(testBoundaryName);
    });


    it("test a too long name", async () => {
        let testTooLongName = "";
        const boundarylength = 140;
        const tooLong = 200;
        for(var i = 0; i < tooLong; i++){
            testTooLongName += "a";
        }

        expect(testTooLongName.length).toEqual(tooLong);

        wrapper.find('input[name="task name"]').simulate('change', {
            target:{ 
                value: testTooLongName
            }
        });

        expect(wrapper.find('input[name="task name"]').prop('value').length).toEqual(boundarylength);
    })


    it("test submit", ()=>{
    
        wrapper.find("button").first().simulate('click');
        expect(mockHandleClose).toHaveBeenCalled();

    })
    
    it("snapshot tests", () => {
        const editTaskDivRender = renderer.create((<DataContext.Provider value = {{
            handleUpsertTask: jest.fn()
         }}
        >
            <EditTaskDiv closeAddTaskMode={mockHandleClose}/>
        </DataContext.Provider>)).toJSON();

        expect(editTaskDivRender).toMatchSnapshot();
    })


  });