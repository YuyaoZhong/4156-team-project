import React, {useState as useStateMock } from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { mockTaskArray, mockTaskListArray, mockRelatedTasksForTimer, genStr, mockEditTimer} from '../../../utilities/mockData';
import { getDefaultTimer, errorMessages } from '../../../utilities/timer-form-utilities';
import { formatDate, formatTime } from '../../../utilities/utilities';
import { DataContext} from '../../../context/data-context';
import { GoogleAuthContext } from '../../../context/google-login-context';
import TimerForm from '../timer-form';
import { DateInput, TimeInput } from 'semantic-ui-calendar-react';

configure({ adapter: new Adapter() });


jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

// mock the third part library to avoid rendering problem
jest.mock('semantic-ui-calendar-react', ()=>({
    DateInput: ({name, value, onChange, onFocus, onBlur, ...rest}) =>(<input name={name} value = {value} onChange={onChange} onFocus={onFocus} onBlur = {onBlur}/>),
    TimeInput: ({name, value, onChange, onFocus, onBlur, ...rest}) =>(<input name={name} value = {value} onChange={onChange} onFocus={onFocus} onBlur = {onBlur}/>),
}));

describe("test <TimerForm/> create", ()=>{
    const setState = jest.fn();
    let getRelatedTasksOfTimers;
    let closeEditMode;
    let handleCreateTimer;
    let wrapper;
    let elementwithProvider;
    let originalTimer;
    const mockNewTimerId = mockEditTimer.id;
    const mockUserId = "0";

  
      
    beforeEach(() => {
        useStateMock.mockImplementation(init => [init, setState]);
        getRelatedTasksOfTimers = jest.fn(); // mock return value
        handleCreateTimer = jest.fn();
        closeEditMode = jest.fn();
        elementwithProvider = (<GoogleAuthContext.Provider
            value={{
                isSignedIn: true,
                googleUser: {googleId: mockUserId},
            }}
           >
               <DataContext.Provider value = {{
                       handleCreateTimer: handleCreateTimer,
                       tasks: mockTaskArray,
                       tasklists: mockTaskListArray,
                       getRelatedTasksOfTimers: ()=>{return mockRelatedTasksForTimer},
                   }}
                   >
              <TimerForm editMode={true} editTimer={mockEditTimer} closeEditMode={closeEditMode}/>
           </DataContext.Provider>
           </GoogleAuthContext.Provider>
        )
       

        wrapper = mount(elementwithProvider);
        originalTimer = getDefaultTimer();
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    
    });


    
   it("test create timer with default value", async () => {
        handleCreateTimer.mockResolvedValue(mockNewTimerId);
        act(()=>{
            // console.log(wrapper.find({floated:"right", type: "button"}).at(1).props())
            wrapper.find({floated:"right", type: "button"}).at(1).simulate('click');
        })
        expect(handleCreateTimer).toHaveBeenCalled();

    });

});