import React from 'react'
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
import { upsertData, deleteData} from '../../../utilities/apiMethods';


configure({ adapter: new Adapter() });


// mock the third part library to avoid rendering problem
jest.mock('semantic-ui-calendar-react', ()=>({
    DateInput: ({name, value, onChange, onFocus, onBlur, ...rest}) =>(<input name={name} value = {value} onChange={onChange} onFocus={onFocus} onBlur = {onBlur}/>),
    TimeInput: ({name, value, onChange, onFocus, onBlur, ...rest}) =>(<input name={name} value = {value} onChange={onChange} onFocus={onFocus} onBlur = {onBlur}/>),
}));

jest.mock('../../../utilities/apiMethods', ()=>({
    upsertData: jest.fn(),
    deleteData: jest.fn()
}));


describe("test <TimerForm/> edit ( including boundary )", ()=>{
    const setState = jest.fn();
    let getRelatedTasksOfTimers;
    let closeEditMode;
    let handleCreateTimer;
    let wrapper;
    let elementwithProvider;
    let originalTimer;
    const mockNewTimerId = mockEditTimer.id;
    const mockUserId = "0";

  
      
    beforeEach(async () => {
        // useStateMock.mockImplementation(init => [init, setState]);
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
                       getRelatedTasksOfTimers: ()=>mockRelatedTasksForTimer,
                   }}
                   >
              <TimerForm editMode={true} editTimer={mockEditTimer} closeEditMode={closeEditMode}/>
           </DataContext.Provider>
           </GoogleAuthContext.Provider>
        )
       

        await act(async ()=>{wrapper = mount(elementwithProvider)}); // for use effect changes
        originalTimer = getDefaultTimer();
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    
    });


    
   it("test edit timer form", async () => {
        handleCreateTimer.mockResolvedValue(mockNewTimerId);
        await act(async ()=>{
            await wrapper.find({floated:"right", type: "button"}).at(1).simulate('click');
            wrapper = wrapper.update();
        })

        // console.log(wrapper.debug());
        expect(handleCreateTimer).toHaveBeenCalled();



    });


        
   it("test attach task to timer", async () => {
        handleCreateTimer.mockResolvedValue(mockNewTimerId);
        let attachedTaskElement = wrapper.find('AttachedTasks');
        // console.log(attachedTaskElement.debug());
        expect(attachedTaskElement.find('ListItem')).not.toExist();

        let findElement = wrapper.find('AttachList')
        await act(async ()=>{
            await findElement.find("button").simulate('click');
            findElement = findElement.update()
            let findTaskToAdd = findElement.find('AttachList').find('ListItem').at(2);
            await findTaskToAdd.simulate('click');
            findTaskToAdd = findTaskToAdd.update();
            attachedTaskElement = findTaskToAdd.find('AttachedTasks');
        
        });

        expect(attachedTaskElement.find('ListItem')).toExist();

        // test submit edit timer
        await act(async()=>{
            wrapper.find({floated:"right", type: "button"}).at(1).simulate('click');
        });

        expect(handleCreateTimer).toHaveBeenCalled();
   });
        


   it("test delete attached tasks", async () => {
    handleCreateTimer.mockResolvedValue(mockNewTimerId);
    getRelatedTasksOfTimers.mockResolvedValue(mockRelatedTasksForTimer);

    act(()=>{
        wrapper = wrapper.update();
    });
    let attachedTaskElement = wrapper.find('AttachedTasks');
    expect(attachedTaskElement.find('ListItem')).toHaveLength(mockRelatedTasksForTimer.length);
    let toDeleteTask = attachedTaskElement.find('ListItem').at(0).find({name:"close", color:"red"});
    // console.log(toDeleteTask.debug());
    // console.log(attachedTaskElement.find('ListItem').debug());

    await act(async ()=>{

        await toDeleteTask.simulate('click');
        wrapper = wrapper.update();
        attachedTaskElement = wrapper.find('AttachedTasks');
    
    });

    // test whether element has been deleted
    expect(attachedTaskElement.find('ListItem')).toHaveLength(mockRelatedTasksForTimer.length - 1);
    // expect(attachedTaskElement.find('ListItem')).toExist();

    await act(async()=>{
        await wrapper.find({floated:"right", type: "button"}).at(1).simulate('click');
        wrapper = wrapper.update();
    });

    expect(handleCreateTimer).toHaveBeenCalled();
});




   // boundary tests;
it("test title with empty check", async () => {
    // await handleCreateTimer.mockResolvedValue(mockNewTimerId);
    const attrName = "title";
    const titleEmpty = "";
    const normalName = "New Timer";

    const targetTitleElement =  wrapper.find('input[name="title"]');
    let errorDiv = wrapper.find({role: "alert"})
    expect(errorDiv).not.toExist(); 

    await act(async ()=>{
        await targetTitleElement.simulate('focus');
        await targetTitleElement.simulate('change', {
            target:{ 
                name: attrName,
                value: titleEmpty,
            }
        });    

    
        await targetTitleElement.simulate('blur');

        wrapper = wrapper.update();
        errorDiv = wrapper.find({role: "alert"}).find('div');
    
    });

    expect(errorDiv.text()).toEqual(errorMessages('empty', attrName));

    // test can not submit

    act(()=>{
        wrapper.find({floated:"right", type: "button"}).at(1).simulate('click');
    })
    expect(handleCreateTimer).not.toHaveBeenCalled();

    // clear errors
    await act(async ()=>{
        await targetTitleElement.simulate('focus');
        wrapper = wrapper.update(); 
        await targetTitleElement.simulate('change', {
            name: attrName,
            value: normalName,
            target:{ 
                name: attrName,
                value: normalName,
            }
        });    
      
        
        await targetTitleElement.simulate('blur')

        wrapper = wrapper.update();
        errorDiv = wrapper.find({role: "alert"});
    });


    expect(errorDiv).not.toExist();

});
 

it("test past start date", async () => {

    const attrName = "date";
    const pastDate = "2019-12-01";
    const futureDate = "2022-12-01";

    const targetElement =  wrapper.find('input[name="date"]');
    const dateErrorLocator = {className: "ui pointing label prompt"};
    let errorDiv = wrapper.find(dateErrorLocator);
    expect(errorDiv).not.toExist(); 


    await act(async ()=>{
        await  targetElement.simulate('focus');
        
        await targetElement.simulate('change',{
            target:{ 
                name: attrName,
                value: pastDate
            }
        }
        );
        
        // targetElement.instance().value = pastDate;
        await targetElement.simulate('blur');
        
        wrapper = wrapper.update();
        errorDiv = wrapper.find(dateErrorLocator);
    });

   
    expect(errorDiv.text()).toEqual(errorMessages('wrong time', attrName));

    
    
    await act(async ()=>{
        await  targetElement.simulate('focus');
        await targetElement.simulate('change',{
            target:{ 
                name: attrName,
                value: futureDate
            }
        }
        );
        
        // targetElement.instance().value = futureDate;

        await targetElement.simulate('blur')
        wrapper = wrapper.update();
        errorDiv = wrapper.find(dateErrorLocator);
    });

    expect(errorDiv).not.toExist(); 

});


it("test date on boundary ", async () => {

    const attrName = "time";
    const today = formatDate(new Date());
    const anHourDiff = 60 * 60000;
    const futureTime = formatTime(new Date(new Date().getTime() + anHourDiff));
    const pastTime = formatTime(new Date(new Date().getTime() - anHourDiff));


    const targetTimeElement =  wrapper.find('input[name="time"]');
    const dateErrorLocator = {className: "ui pointing label prompt"};
    let errorDiv = wrapper.find(dateErrorLocator);
    expect(errorDiv).not.toExist(); 


    await act(async ()=>{
        await targetTimeElement.simulate('focus');

        await targetTimeElement.simulate('change',{
            target:{ 
                name: attrName,
                value: pastTime
            }
        }
        );
        
        // targetTimeElement.instance().value = pastTime;

        await targetTimeElement.simulate('blur')
        wrapper = wrapper.update();
        errorDiv = wrapper.find(dateErrorLocator);
    });


    expect(errorDiv.text()).toEqual(errorMessages('wrong time', attrName));
  

    
    await act(async ()=>{
        await  targetTimeElement.simulate('focus');
        
        await targetTimeElement.simulate('change',{
            target:{ 
                name: attrName,
                value: futureTime
            }
        }
        );
        
        // targetTimeElement.instance().value = futureTime;
        await targetTimeElement.simulate('blur')
        wrapper = wrapper.update();
        errorDiv = wrapper.find(dateErrorLocator);
    });
   
    expect(errorDiv).not.toExist(); 


});



});