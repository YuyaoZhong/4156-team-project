import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { DataContext} from '../../../context/data-context';
import { useParams } from 'react-router-dom'
import { mockTaskListArray } from '../../../utilities/mockData';
import {act} from "react-dom/cjs/react-dom-test-utils.development";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import fetchMock from 'fetch-mock-jest';
import SingleTimer from '../timer-info';
// import { getSharingUrl } from '../../../utilities/timer-utilities';

configure({ adapter: new Adapter() });

jest.mock('react-router-dom', ()=>({
    ...jest.requireActual('react-router-dom'),
    useParams: ()=>{
        // const timerid = 60000;
        const timerid = 'dGltZXJJZD02MDAwMCZjcmVhdG9yPTA=';
        return {timerid: timerid};
    }
}));


jest.mock('../../timerpage/timer-form', ()=>({closeEditMode})=><div name = "timer form">
    <button onClick={closeEditMode}>Cancel</button>
</div>);
jest.mock('../../zoom/zoom-button', ()=>()=><div/>);
jest.mock('../../timers/share-button', ()=>()=><div/>);
jest.mock('../display-timer', ()=>()=><div name="display timer"> Display Timer</div>);
// jest.mock('../display-timer-area', ()=>()=>(<div name="display-timer-area">Display Time Area</div>))
// jest.mock('../timer-message', ()=>()=>(<div>Message</div>));


describe("test <SingleTimer/>", () => {
    // mockDisplayTimer;
    let wrapper;


    const mockTimerCreator = {
        breakTime: 5,
        description: "",
        duration: 25,
        id: 60000,
        isCreator: true,
        round: 1,
        startTime: new Date(),
        timerToUserId: "0",
        title: "test my timer",
        userId: "0",
        zoomLink: "None",
        added: true
    };

    const mockTimerShared = {
        breakTime: 5,
        description: "",
        duration: 25,
        id: 60000,
        isCreator: false,
        round: 1,
        startTime: new Date(),
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None",
        added: false,
    };

    const mockTimerShareAdded = {...mockTimerShared};
    mockTimerShareAdded.added = true;

    const waitUntil=  (fnWait) => {
        return new Promise((resolve, reject)=>{
            let count = 0;
            const check = () => {
                if (++count > 20){
                    reject(new TypeError('Timeout'));
                    return;
                }
                if(fnWait()){
                    resolve();
                }
                setTimeout(check, 10);
            }
            check();
        });
    }

    const waitForFetch = async (fetchMock) =>{
        await waitUntil(()=>fetchMock.called());
        await fetchMock.flush();
    }


    afterEach(()=>{
        fetchMock.mockReset();
    });

    it('test nomral timer display', async ()=>{
        fetchMock.mockReset();
        fetchMock.get('*',{
            code: 200, 
            message: "success",
            data: mockTimerCreator
        });

        await act(async () => {
            wrapper = mount((<Router>
                <DataContext.Provider value = {{
                userId: "0",
                updateTimerListState: jest.fn(),
                tasklists: mockTaskListArray,
                getRelatedTasksOfTimers: ()=>mockRelatedTasksForTimer,
             }}
            >
                <SingleTimer />
            </DataContext.Provider>
            </Router>))
           })

        await act(async ()=>{
            await waitForFetch(fetchMock);
            await wrapper.update();
        });

        // console.log(wrapper.debug());
        expect(wrapper.find({name: "display timer"})).toExist();

    });


    it('test not found timer', async ()=>{
        fetchMock.mockReset();
        fetchMock.get('*',{
            code: 404, 
            message: "success",
            data: {}
        });

       await act(async () => {
        wrapper = mount((<Router>
            <DataContext.Provider value = {{
            userId: "0",
            updateTimerListState: jest.fn(),
            tasklists: mockTaskListArray,
         }}
        >
            <SingleTimer />
        </DataContext.Provider>
        </Router>))
       })

        await act(async ()=>{
            await waitForFetch(fetchMock);
            wrapper = wrapper.update();
        });

        expect(wrapper.find({name: "display timer"})).not.toExist();
        // expect(wrapper.find({name: "display timer"})).not.toExist();

    });


    it('test no user', async ()=>{
        // fetchMock.mockReset();
        // fetchMock.get('*',{
        //     code: 200, 
        //     message: "success",
        //     data: mockTimerCreator
        // });

       await act(async () => {
        wrapper = mount((<Router>
            <DataContext.Provider value = {{
            userId: "",
            updateTimerListState: jest.fn(),
            tasklists: mockTaskListArray,
         }}
        >
            <SingleTimer />
        </DataContext.Provider>
        </Router>))
       })


        expect(wrapper.find({name: "display timer"})).not.toExist();

    });

    it('test show and close edit model', async ()=>{
        fetchMock.mockReset();
        fetchMock.get('*',{
            code: 200, 
            message: "success",
            data: mockTimerCreator
        });

        await act(async () => {
            wrapper = mount((<Router>
                <DataContext.Provider value = {{
                userId: "0",
                updateTimerListState: jest.fn(),
                tasklists: mockTaskListArray,
             }}
            >
                <SingleTimer />
            </DataContext.Provider>
            </Router>))
           })

        await act(async ()=>{
            await waitForFetch(fetchMock);
            await wrapper.update();
        });

        await act(async ()=>{
            await wrapper.find('button').at(0).simulate('click');
            wrapper = wrapper.update();
        });

        await act(async ()=>{
            await wrapper.find('button').simulate('click');
            wrapper = wrapper.update();
        });
        // expect(wrapper.find({name: "display timer"})).toExist();

        
        expect(wrapper.find({name: "timer form"})).not.toExist();
    });


    it('test change add timer status', async() => {

        fetchMock.mockReset();
        fetchMock.get('*',{
            code: 200, 
            message: "success",
            data:  mockTimerShared,
        });

        fetchMock.post('*', {
            code: 201,
            message: 'success',
            data: mockTimerShareAdded,
        })


        await act(async () => {
            wrapper = mount((<Router>
                <DataContext.Provider value = {{
                userId: "0",
                updateTimerListState: jest.fn(),
                tasklists: mockTaskListArray,
             }}
            >
                <SingleTimer />
            </DataContext.Provider>
            </Router>))

           })

        await act(async ()=>{
            await waitForFetch(fetchMock);
            wrapper = wrapper.update();
        });
        
        expect(wrapper.find('button')).toExist();

        let addButton = wrapper.find('button').at(1);

        expect(addButton).toExist();
        
        await act(async ()=>{
            await addButton.simulate('click');
            await waitForFetch(fetchMock);
            wrapper = wrapper.update();
        })

        let messageHeader = wrapper.find('MessageHeader');
        expect(messageHeader).toExist();
        expect(messageHeader.find('div').text()).toEqual('Success');

        jest.useFakeTimers();
        await act(async ()=>{
            await jest.advanceTimersByTime(4000);
            wrapper = wrapper.update();
        });

    });


    it('test change add timer fail', async() => {

        fetchMock.mockReset();
        fetchMock.get('*',{
            code: 200, 
            message: "success",
            data:  mockTimerShared,
        });

        fetchMock.post('*', {
            code: 500,
            message: 'fail',
            data: null,
        })


        await act(async () => {
            wrapper = mount((<Router>
                <DataContext.Provider value = {{
                userId: "0",
                updateTimerListState: jest.fn(),
                tasklists: mockTaskListArray,
             }}
            >
                <SingleTimer />
            </DataContext.Provider>
            </Router>))

           })

        await act(async ()=>{
            await waitForFetch(fetchMock);
            wrapper = wrapper.update();
        });
        
        expect(wrapper.find('button')).toExist();

        let addButton = wrapper.find('button').at(1);

        expect(addButton).toExist();
        
        await act(async ()=>{
            await addButton.simulate('click');
            await waitForFetch(fetchMock);
            wrapper = wrapper.update();
        })


        let messageHeader = wrapper.find('MessageHeader');
        expect(messageHeader).toExist();
        expect(messageHeader.find('div').text()).toEqual('Error');

        // jest.useFakeTimers();
        // await act(async ()=>{
        //     await jest.advanceTimersByTime(4000);
        //     wrapper =  wrapper.update();
        // });

        await act(async ()=>{
            await wrapper.find('div').at(0).simulate('click');
            wrapper = wrapper.update();
        });
        
    });


});
