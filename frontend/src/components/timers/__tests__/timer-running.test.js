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


configure({ adapter: new Adapter() });

// jest.mock('../../taskList/task-list', ()=>({
// TaskListArea: ()=>(<div>Task List Area</div>)
// }));
describe("test <RunningTimerContainer/>", () => {
    // mockTimerDetail;
    let wrapper;

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
    }

    // it("test no timer ", async () => {
    //     wrapper = mount(<DataContext.Provider value = {{
    //         timerRun: undefined
    //      }}>
    //         <RunningTimerContainer/>
    //     </DataContext.Provider>);
    //     console.log(wrapper.debug());
    //     expect(wrapper.find({size: "huge"}).length).toEqual(0);
    // });

    it("test timer running ", async () => {
        await act (async ()=>{wrapper = mount(<DataContext.Provider value = {{
            timerRun: mockTimer
         }}>
            <RunningTimerContainer/>
        </DataContext.Provider>);
        console.log(wrapper.debug())});
        expect(wrapper.find({size: "huge"}).length).toEqual(0);
    });


});

