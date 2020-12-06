import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import {TimerDetailAttr} from '../../timers/timer-detail-info';
import {mockRelatedTasksForTimer} from '../../../utilities/mockData';
import {mockEditTimer} from '../../../utilities/mockData';
import RunningTimerContainer from "../timer-running";
import {act} from "react-dom/cjs/react-dom-test-utils.development";
import {getcurRound} from "../../../utilities/timer-utilities";


configure({ adapter: new Adapter() });

// jest.mock('../../taskList/task-list', ()=>({
// TaskListArea: ()=>(<div>Task List Area</div>)
// }));
jest.mock('../../timers/display-timer', ()=>()=><div/>);
// jest.mock('../../../utilities/timer-utilities', ()=>({
//     getTimeLeft: jest.fn().mockReturnValue(-20),
//     getcurRound: jest.fn().mockReturnValue(2),
//     inBreak: jest.fn().mockReturnValue(true),
//     formatTime: jest.fn().mockReturnValue('2020-12-07'),
// }));

describe("test <RunningTimerContainer/>", () => {
    // mockRunningTimer;
    let wrapper;
    let cleanupFunc;

    const mockTimer = {
        breakTime: 1,
        description: "",
        duration: 3,
        id: -4,
        isCreator: false,
        round: 1,
        startTime: new Date(),
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    }
    const mockTimer2 = {
        breakTime: 1,
        description: "",
        duration: 2,
        id: -4,
        isCreator: false,
        round: 1,
        startTime: '2020-12-03T20:50:00.000Z',
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    }

    const mockTimer3 = {
        breakTime: 3,
        description: "",
        duration: 2,
        id: -4,
        isCreator: false,
        round: 2,
        startTime: new Date().getTime()-2*60000,
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    }
    const mockTimer4 = {
        breakTime: 1,
        description: "",
        duration: 2,
        id: 5,
        isCreator: false,
        round: 0,
        startTime: new Date(),
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    }

    const mockTimer5 = {
        breakTime: 1,
        description: "",
        duration: 2,
        id: -4,
        isCreator: false,
        round: 0,
        startTime: '2020-12-08T20:50:00.000Z',
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    }


    it("test no timer ", async () => {
        wrapper = mount(<DataContext.Provider value = {{
            timerRun: undefined
         }}>
            <RunningTimerContainer/>
        </DataContext.Provider>);
        console.log(wrapper.debug());
        expect(wrapper.find({size: "huge"}).length).toEqual(0);
    });

    it("test timer running ", async () => {
        jest.useFakeTimers();
        await act (async ()=>{wrapper = mount(<DataContext.Provider value = {{
            timerRun: mockTimer
         }}>
            <RunningTimerContainer/>
        </DataContext.Provider>);
        console.log(wrapper.debug())});
        await act(async ()=>{
            jest.advanceTimersByTime(1000);
            wrapper = wrapper.update();
        });
        expect(wrapper.find({size: "huge"}).length).toEqual(3);
    });

    it("test timer running2 ", async () => {
        jest.useFakeTimers();
        await act (async ()=>{wrapper = mount(<DataContext.Provider value = {{
            timerRun: mockTimer2
         }}>
            <RunningTimerContainer/>
        </DataContext.Provider>);
        console.log(wrapper.debug())});
        await act(async ()=>{
            jest.advanceTimersByTime(1000);
            wrapper = wrapper.update();
        });
        expect(wrapper.find({size: "huge"}).length).toEqual(1);
    });

    it("test timer running3 ", async () => {
        jest.useFakeTimers();
        await act (async ()=>{wrapper = mount(<DataContext.Provider value = {{
            timerRun: mockTimer3
         }}>
            <RunningTimerContainer/>
        </DataContext.Provider>);});
        await act(async ()=>{
            jest.advanceTimersByTime(150);
            wrapper = wrapper.update();
        });
        expect(wrapper.find({size: "huge"}).length).toEqual(2);
    });

    it("test timer running4 ", async () => {
        // jest.useFakeTimers();
        await act (async ()=>{wrapper = mount(<DataContext.Provider value = {{
            timerRun: mockTimer4
         }}>
            <RunningTimerContainer/>
        </DataContext.Provider>);});
        await act(async ()=>{
            jest.advanceTimersByTime(500);
            wrapper = wrapper.update();
        });
        expect(wrapper.find({size: "huge"}).length).toEqual(1);
    });

    it("test timer running5 ", async () => {
        await act (async ()=>{wrapper = mount(<DataContext.Provider value = {{
            timerRun: mockTimer5
         }}>
            <RunningTimerContainer/>
        </DataContext.Provider>);});
        expect(wrapper.find({size: "huge"}).length).toEqual(1);
    });


});

