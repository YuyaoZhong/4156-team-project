import React from 'react'
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest-enzyme';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import NewTaskListCard from '../new-tasklist-card';

configure({ adapter: new Adapter() });

describe("Test <NewTaskListCard/> ", () => {
    let mockHandleClose;
    let wrapper;

    beforeEach(() => {
        mockHandleClose = jest.fn();
        wrapper = mount(<DataContext.Provider value = {{
            handleUpsertTaskList: jest.fn()
         }}
        >
            <NewTaskListCard closeAddTaskListMode={mockHandleClose}/>
        </DataContext.Provider>)
        // wrapper = shallow(<EditTaskDiv closeAddTaskMode={mockHandleClose}/>);
      });

    it("test an valid task list name", async () => {
       const testName = "Test Task List";
       wrapper.find('input[name="tasklist name"]').simulate('change', {
           target:{ 
               value: testName
           }
       });

       expect(wrapper.find('input[name="tasklist name"]').prop('value')).toEqual(testName);
    });

    it("test a boundary name", async () => {
        let testBoundaryName = "";
        const boundarylength = 140;
        for(var i = 0; i < boundarylength; i++){
            testBoundaryName += "a";
        }

        expect(testBoundaryName.length).toEqual(boundarylength);

        wrapper.find('input[name="tasklist name"]').simulate('change', {
            target:{ 
                value: testBoundaryName
            }
        });

        expect(wrapper.find('input[name="tasklist name"]').prop('value')).toEqual(testBoundaryName);
    });


    it("test a too long name", async () => {
        let testTooLongName = "";
        const boundarylength = 140;
        const tooLong = 200;
        for(var i = 0; i < tooLong; i++){
            testTooLongName += "a";
        }

        expect(testTooLongName.length).toEqual(tooLong);

        wrapper.find('input[name="tasklist name"]').simulate('change', {
            target:{ 
                value: testTooLongName
            }
        });

        expect(wrapper.find('input[name="tasklist name"]').prop('value').length).toEqual(boundarylength);
    })


    it("test submit edit task list", ()=>{
    
        wrapper.find("button").at(1).simulate('click');
        expect(mockHandleClose).toHaveBeenCalled();

    })
    
    it("snapshot tests for new task lists", () => {
        const editRender = renderer.create((<DataContext.Provider value = {{
            handleUpsertTaskList: jest.fn()
         }}
        >
            <NewTaskListCard closeAddTaskListMode={mockHandleClose}/>
        </DataContext.Provider>)).toJSON();

        expect(editRender).toMatchSnapshot();
    })


  });