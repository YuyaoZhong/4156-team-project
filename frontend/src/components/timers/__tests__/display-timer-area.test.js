import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { DataContext} from '../../../context/data-context';
import DisplayTimerArea from '../display-timer-area';
import { mockRelatedTasksForTimer } from '../../../utilities/mockData';
import {act} from "react-dom/cjs/react-dom-test-utils.development";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import fetchMock from 'fetch-mock-jest';


configure({ adapter: new Adapter() });

// jest.mock('../../../utilities/apiMethods', ()=>({
//     upsertData: jest.fn(),
//     deleteData: jest.fn()
// }));

jest.mock('../../timerpage/timer-form', ()=>()=><div name = "timer form"/>);
jest.mock('../../zoom/zoom-button', ()=>()=><div/>);
jest.mock('../../timers/share-button', ()=>()=><div/>);
jest.mock('../display-timer', ()=>()=><div/>);


describe("test <DisplayTimerArea/>", () => {
    // mockDisplayTimer;
    let wrapper;
    let changeAddedStatus;
    let closeEditMode;
    let openEditMode;
    let updateTimerListState;
    let getRelatedTasksOfTimers;

    const mockTimerCreator = {
        breakTime: 5,
        description: "",
        duration: 25,
        id: -4,
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
        id: -4,
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

    beforeEach(() => {
        changeAddedStatus = jest.fn();
        closeEditMode = jest.fn();
        openEditMode = jest.fn();
        updateTimerListState = jest.fn();
        getRelatedTasksOfTimers = jest.fn().mockReturnValue(mockRelatedTasksForTimer);
    });



    it("test editMode true", async () => {

        await act(async ()=>{wrapper=  mount(<Router>
                <DataContext.Provider value = {{
                updateTimerListState: updateTimerListState,
                getRelatedTasksOfTimers: getRelatedTasksOfTimers,
            }}>
                <DisplayTimerArea timer = {mockTimerCreator} changeAddedStatus = {changeAddedStatus}
                editMode = {true} closeEditMode = {closeEditMode} openEditMode = {openEditMode} />
            </DataContext.Provider>
        </Router>)});
        expect(wrapper.find({name: 'timer form'})).toExist();
    });


    it("test display timer of creator", async () => {

        await act(async ()=>{wrapper=  mount(<Router>
                <DataContext.Provider value = {{
                updateTimerListState: updateTimerListState,
                getRelatedTasksOfTimers: getRelatedTasksOfTimers,
            }}>
                <DisplayTimerArea timer = {mockTimerCreator} changeAddedStatus = {changeAddedStatus}
                editMode = {false} closeEditMode = {closeEditMode} openEditMode = {openEditMode} />
            </DataContext.Provider>
        </Router>)});

        expect(wrapper.find('button').at(0).text()).toEqual('Edit');
    });

    it("test display of shared timer and add", async () => {

        fetchMock.mockReset();
        fetchMock.post('*', {
            code: 201,
            message: "success",
            data: mockTimerShareAdded,
        });


        await act(async ()=>{wrapper=  mount(<Router>
                <DataContext.Provider value = {{
                updateTimerListState: updateTimerListState,
                getRelatedTasksOfTimers: getRelatedTasksOfTimers,
            }}>
                <DisplayTimerArea timer = {mockTimerShared} changeAddedStatus = {changeAddedStatus}
                editMode = {false} closeEditMode = {closeEditMode} openEditMode = {openEditMode} />
            </DataContext.Provider>
        </Router>)});

        // can not edit;
        expect(wrapper.find('button').at(0).text()).not.toEqual('Edit');
        let addTimerButton = wrapper.find('button').at(1);
        await act(async ()=>{
         
            await addTimerButton.simulate('click');
            await waitForFetch(fetchMock);
        });

        expect(fetchMock).toHaveBeenCalled();
    
    });

    it("test added share timer", async () => {

        await act(async ()=>{wrapper=  mount(<Router>
                <DataContext.Provider value = {{
                updateTimerListState: updateTimerListState,
                getRelatedTasksOfTimers: getRelatedTasksOfTimers,
            }}>
                <DisplayTimerArea timer = {mockTimerShareAdded} changeAddedStatus = {changeAddedStatus}
                editMode = {false} closeEditMode = {closeEditMode} openEditMode = {openEditMode} />
            </DataContext.Provider>
        </Router>)});

        expect(wrapper.find('button')).toHaveLength(1);
    });


    it("test fail retrieve", async () => {

        fetchMock.mockReset();
        fetchMock.post('*', {
            code: 500,
            message: "fail",
            data: null,
        });


        await act(async ()=>{wrapper=  mount(<Router>
                <DataContext.Provider value = {{
                updateTimerListState: updateTimerListState,
                getRelatedTasksOfTimers: getRelatedTasksOfTimers,
            }}>
                <DisplayTimerArea timer = {mockTimerShared} changeAddedStatus = {changeAddedStatus}
                editMode = {false} closeEditMode = {closeEditMode} openEditMode = {openEditMode} />
            </DataContext.Provider>
        </Router>)});

        let addTimerButton = wrapper.find('button').at(1);
        await act(async ()=>{
         
            await addTimerButton.simulate('click');
            await waitForFetch(fetchMock);
        });

        expect(fetchMock).toHaveBeenCalled();
    
    });
});
