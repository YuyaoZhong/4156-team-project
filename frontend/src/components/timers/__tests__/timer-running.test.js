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


configure({ adapter: new Adapter() });

// jest.mock('../../taskList/task-list', ()=>({
// TaskListArea: ()=>(<div>Task List Area</div>)
// }));
describe("test <RunningTimerContainer/>", () => {
    // mockTimerDetail;
    let wrapper;

    // it("test huge size ", async () => {
    //     wrapper = mount(<DataContext.Provider value = {{
    //      }}>
    //         <RunningTimerContainer/>
    //     </DataContext.Provider>);
    //
    //     expect(wrapper.find({size: "huge"}).length).toEqual(2);
    // });

    it("test no timer ", async () => {
        wrapper = mount(<DataContext.Provider value = {{
         }}>
            <RunningTimerContainer/>
        </DataContext.Provider>);
        console.log(wrapper.debug());
        expect(wrapper.find({size: "huge"}).length).toEqual(2);
    });


});

