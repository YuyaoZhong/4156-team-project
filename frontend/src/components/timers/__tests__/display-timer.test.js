import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { DataContext} from '../../../context/data-context';
import { mockRelatedTasksForTimer, mockTaskListArray} from '../../../utilities/mockData';
import { act } from "react-dom/cjs/react-dom-test-utils.development";
import DisplayTimer from '../display-timer';



configure({ adapter: new Adapter() });

jest.mock('../../../utilities/apiMethods', ()=>({
    upsertData: jest.fn(),
    deleteData: jest.fn()
}));

jest.mock('../../timerpage/timer-form', ()=>()=><div/>);
jest.mock('../../zoom/zoom-button', ()=>()=><div/>);
jest.mock('../../timers/share-button', ()=>()=><div/>);


describe("test <DisplayTimer/>", () => {
    // mockDisplayTimer;
    let wrapper;
    let getRelatedTasksOfTimers;
    const baseTaskLists = [
   {
    id: -1,
    name: "Test TaskList 1",
    userId: "0"
   },
   {
    id: -2,
    name: "Test TaskList 2",
    userId: "0"
   }
   ];
    const mockTimer = {
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
        zoomLink: "None"
    };

    beforeEach(() => {
        getRelatedTasksOfTimers = jest.fn().mockReturnValue(mockRelatedTasksForTimer);
    });

    it("test editMode true ", async () => {

        await act(async ()=>{wrapper=  mount(<DataContext.Provider value = {{
            getRelatedTasksOfTimers: getRelatedTasksOfTimers,
            tasklists: baseTaskLists
         }}>
            <DisplayTimer timer = {mockTimer} editMode = {false} />
        </DataContext.Provider>)});
        expect(wrapper.find({name: "Related Tasks"}).length).toEqual(0);
    });

    it("test editMode false ", async () => {

        await act(async ()=>{wrapper=  mount(<DataContext.Provider value = {{
            getRelatedTasksOfTimers: getRelatedTasksOfTimers,
            tasklists: baseTaskLists
         }}>
            <DisplayTimer timer = {mockTimer} editMode = {true} />
        </DataContext.Provider>)});
        expect(wrapper.find({name: "Related Tasks"}).length).toEqual(0);
    });


    it("test with related tasts", async () => {

        await act(async ()=>{
            wrapper=  mount(<DataContext.Provider value = {{
            getRelatedTasksOfTimers: ()=>mockRelatedTasksForTimer,
            tasklists: mockTaskListArray
         }}>
            <DisplayTimer timer = {mockTimer} editMode = {true} />
        </DataContext.Provider>)});
        expect(wrapper.find('ListItem')).toHaveLength(mockTaskListArray.length);
    });
});
