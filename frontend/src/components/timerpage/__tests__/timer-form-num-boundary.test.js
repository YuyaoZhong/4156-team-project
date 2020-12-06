import React  from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { mockTaskArray, mockTaskListArray, mockRelatedTasksForTimer, genStr} from '../../../utilities/mockData';
import { getDefaultTimer, errorMessages } from '../../../utilities/timer-form-utilities';
import { formatDate, formatTime } from '../../../utilities/utilities';
import { DataContext} from '../../../context/data-context';
import { GoogleAuthContext } from '../../../context/google-login-context';
import TimerForm from '../timer-form';
import { DateInput, TimeInput } from 'semantic-ui-calendar-react';
import { Redirect } from 'react-router-dom';

configure({ adapter: new Adapter() });

jest.mock('react-router-dom', ()=>({
    Redirect: ({to})=>(<div>New Timer {to}</div>)
}))

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
    const mockNewTimerId = -100;
    const mockUserId = "0";

  
      
    beforeEach(() => {
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
              <TimerForm editMode={false} closeEditMode={closeEditMode}/>
           </DataContext.Provider>
           </GoogleAuthContext.Provider>
        )
       

        wrapper = mount(elementwithProvider);
        originalTimer = getDefaultTimer();
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    
    });


   it("test redirect after create new timer", async () => {
        handleCreateTimer.mockResolvedValue(mockNewTimerId);
        await act(async ()=>{
           await wrapper.find({floated:"right", type: "button"}).at(1).simulate('click');
           wrapper = wrapper.update();
        })

        expect(handleCreateTimer).toHaveBeenCalled();

   });


   it("test negative duration", async () => {

    const attrName = "duration";
    const invalid = -1;
    const valid = 25;

    const targetElement =  wrapper.find(`input[name="${attrName}"]`);
    const errorLocator = {role: "alert"};
    let errorDiv = wrapper.find(errorLocator);
    expect(errorDiv).not.toExist(); 


    await act(async ()=>{
        await  targetElement.simulate('focus');
        
        await targetElement.simulate('change',{
            target:{ 
                name: attrName,
                value: invalid,
            }
        }
        );
        
        // targetElement.instance().value = pastDate;
        await targetElement.simulate('blur');
        
        wrapper = wrapper.update();
        errorDiv = wrapper.find(errorLocator);
    });

   
    expect(errorDiv.at(0).text()).toEqual(errorMessages('non-positive number', attrName));

    
    
    await act(async ()=>{
        await  targetElement.simulate('focus');
        await targetElement.simulate('change',{
            target:{ 
                name: attrName,
                value: valid
            }
        }
        );
        
        // targetElement.instance().value = futureDate;

        await targetElement.simulate('blur')
        wrapper = wrapper.update();
        errorDiv = wrapper.find(errorLocator);
    });

    expect(errorDiv).not.toExist(); 

});


it("test invalid string and valid data for break time", async () => {

    const attrName = "breakTime";
    const invalid = "eeee";
    const valid = 5;

    const targetElement =  wrapper.find(`input[name="${attrName}"]`);
    const errorLocator = {role: "alert"};
    let errorDiv = wrapper.find(errorLocator);
    expect(errorDiv).not.toExist(); 


    await act(async ()=>{
        await  targetElement.simulate('focus');
        
        await targetElement.simulate('change',{
            target:{ 
                name: attrName,
                value: invalid,
            }
        }
        );
        
        // targetElement.instance().value = pastDate;
        await targetElement.simulate('blur');
        
        wrapper = wrapper.update();
        errorDiv = wrapper.find(errorLocator);
    });

   
    expect(errorDiv.at(0).text()).toEqual(errorMessages('numeric error', attrName));

    
    
    await act(async ()=>{
        await  targetElement.simulate('focus');
        await targetElement.simulate('change',{
            target:{ 
                name: attrName,
                value: valid
            }
        }
        );
        
        // targetElement.instance().value = futureDate;

        await targetElement.simulate('blur')
        wrapper = wrapper.update();
        errorDiv = wrapper.find(errorLocator);
    });

    expect(errorDiv).not.toExist(); 

});



it("test round error", async () => {

    const attrName = "round";
    const invalid = 0;
    const valid = 5;

    const targetElement =  wrapper.find(`input[name="${attrName}"]`);
    const errorLocator = {role: "alert"};
    let errorDiv = wrapper.find(errorLocator);
    expect(errorDiv).not.toExist(); 


    await act(async ()=>{
        await  targetElement.simulate('focus');
        
        await targetElement.simulate('change',{
            target:{ 
                name: attrName,
                value: invalid,
            }
        }
        );
        
        // targetElement.instance().value = pastDate;
        await targetElement.simulate('blur');
        
        wrapper = wrapper.update();
        errorDiv = wrapper.find(errorLocator);
    });

   
    expect(errorDiv.at(0).text()).toEqual(errorMessages('non-positive number', attrName));

    
    
    await act(async ()=>{
        await  targetElement.simulate('focus');
        await targetElement.simulate('change',{
            target:{ 
                name: attrName,
                value: valid
            }
        }
        );
        
        // targetElement.instance().value = futureDate;

        await targetElement.simulate('blur')
        wrapper = wrapper.update();
        errorDiv = wrapper.find(errorLocator);
    });

    expect(errorDiv).not.toExist(); 

});


    it('test without sign in', async ()=>{
        elementwithProvider = (<GoogleAuthContext.Provider
            value={{
                isSignedIn: false,
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
              <TimerForm editMode={false} closeEditMode={closeEditMode}/>
           </DataContext.Provider>
           </GoogleAuthContext.Provider>
        )

        wrapper = mount(elementwithProvider);
        handleCreateTimer.mockResolvedValue();

        await act(async ()=>{
            await wrapper.find({floated:"right", type: "button"}).at(1).simulate('click');
            wrapper = wrapper.update();
         })
 
         expect(closeEditMode).toHaveBeenCalled();

    })

});