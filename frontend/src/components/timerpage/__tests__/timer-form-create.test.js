import React, {useState as useStateMock } from 'react'
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
    const mockNewTimerId = -100;
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


   it("test create timer with default value", () => {
        handleCreateTimer.mockResolvedValue(mockNewTimerId);
        act(()=>{
            wrapper.find({floated:"right", type: "button"}).at(1).simulate('click');
        })
        expect(handleCreateTimer).toHaveBeenCalled();

   });

    it("test a boundary title", async () => {
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        const testBoundaryName = genStr(140);
        originalTimer.title = testBoundaryName;
        expect(testBoundaryName.length).toEqual(140);
        
        act(()=>{
            wrapper.find('input[name="title"]').simulate('change', {
                target:{ 
                    name: "title",
                    value: testBoundaryName
                }
            });    
        })

        // test hooks
        expect(setState).toHaveBeenCalledWith(originalTimer);

    });


    it("test a too long description", async () => {
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        const tooLongDescription = genStr(200);
        const expectDescription = tooLongDescription.slice(0, 140);
        originalTimer.description = expectDescription; // expect to be cut
        expect(tooLongDescription.length).toEqual(200);
        
        act(()=>{
            wrapper.find('input[name="description"]').simulate('change', {
                target:{ 
                    name: "description",
                    value: tooLongDescription 
                }
            });    
        })

        // test hooks
        expect(setState).toHaveBeenCalledWith(originalTimer);

    });


    it("test empty title will report error, then update with correct title", async () => {
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        const attrName = "title";
        const titleEmpty = null;
        const normalName = "New Timer";

        const targetTitleElement =  wrapper.find('input[name="title"]');
        expect(setState).toHaveBeenCalledTimes(0);
  

        act(async ()=>{
            await targetTitleElement.simulate('focus');

           

            await targetTitleElement.simulate('change', {
                target:{ 
                    name: attrName,
                    value: titleEmpty,
                }
            });    

            targetTitleElement.instance().value = titleEmpty; // setting value force
          
            
            await targetTitleElement.simulate('blur')
        });



        expect(setState).toHaveBeenCalledWith(
            expect.objectContaining({
                [attrName]: errorMessages('empty', attrName)
            })
        );


        // clear errors
        act(async ()=>{
            await targetTitleElement.simulate('focus');

           

            await targetTitleElement.simulate('change', {
                name: attrName,
                value: normalName,
                target:{ 
                    name: attrName,
                    value: normalName,
                }
            });    

            targetTitleElement.instance().value = normalName; // setting value force
          
            
            await targetTitleElement.simulate('blur')
        });


        expect(setState).toHaveBeenCalledWith({});



    });
     

    it("test wrong start date and update with correct", async () => {
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        // wrapper = shallow(elementwithProvider);
        const attrName = "date";
        const pastDate = "2019-12-01";
        const futureDate = "2022-12-01";

        const targetElement =  wrapper.find('input[name="date"]');

      

        act(async ()=>{
            await  targetElement.simulate('focus');
            
            await targetElement.simulate('change',{
                target:{ 
                    name: attrName,
                    value: pastDate
                }
            }
            );
            
            targetElement.instance().value = pastDate;

            await targetElement.simulate('blur')
        });

        wrapper = wrapper.update();
        expect(setState).toHaveBeenCalledWith(
            expect.objectContaining({
                [attrName]: errorMessages('wrong time', attrName)
            })
        );

        
        
        act(async ()=>{
            await  targetElement.simulate('focus');
            
            await targetElement.simulate('change',{
                target:{ 
                    name: attrName,
                    value: futureDate
                }
            }
            );
            
            targetElement.instance().value = futureDate;

            await targetElement.simulate('blur')
        });

        wrapper = wrapper.update();
        expect(setState).toBeCalledWith({});

    });


    it("test date on boundary ", async () => {
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);

        const attrName = "time";
        const today = formatDate(new Date());
        const anHourDiff = 60 * 60000;
        const futureTime = formatTime(new Date(new Date().getTime() + anHourDiff));
        const pastTime = formatTime(new Date(new Date().getTime() - anHourDiff));


        const targetTimeElement =  wrapper.find('input[name="time"]');

      

        await act(async ()=>{
            await targetTimeElement.simulate('focus');
            
            await targetTimeElement.simulate('change',{
                target:{ 
                    name: attrName,
                    value: pastTime
                }
            }
            );
            
            targetTimeElement.instance().value = pastTime;

            await targetTimeElement.simulate('blur')
        });
        wrapper = wrapper.update();



        expect(setState).toHaveBeenCalledWith(
            expect.objectContaining({
                [attrName]: errorMessages('wrong time', attrName)
            })
        );


      

        
        act(async ()=>{
            await  targetTimeElement.simulate('focus');
            
            await targetTimeElement.simulate('change',{
                target:{ 
                    name: attrName,
                    value: futureTime
                }
            }
            );
            
            targetTimeElement.instance().value = futureTime;
            await targetTimeElement.simulate('blur')
        });
        wrapper = wrapper.update();


        expect(setState).toBeCalledWith({});


    });




});