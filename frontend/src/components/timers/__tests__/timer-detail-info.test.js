import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import {TimerDetailAttr} from '../../timers/timer-detail-info';
import { TaskListArea } from '../../taskList/task-list';
import TimerDetailInfo from '../../timers/timer-detail-info';
import {mockRelatedTasksForTimer} from '../../../utilities/mockData';
import {mockEditTimer} from '../../../utilities/mockData';


configure({ adapter: new Adapter() });

jest.mock('../../taskList/task-list', ()=>({
TaskListArea: ()=>(<div>Task List Area</div>)
}));
describe("test <TimerDetailAttr/>", () => {
    // mockTimerDetail;
    let wrapper;

    it("test huge size ", async () => {

        wrapper = mount(
            <TimerDetailAttr name = {"test"} size = {"huge"} />
        );
        expect(wrapper.find({size: "huge"}).length).toEqual(2);
    });

    it("test small size ", async () => {

        wrapper = mount(
            <TimerDetailAttr name = {"test"} />
        );
        expect(wrapper.find({size: "huge"}).length).toEqual(1);
    });

});

describe("test <TimerDetailInfo/>", () => {
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

    const mockTimer2 = {
        breakTime: 5,
        description: "test!!!",
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
    const relatedTasks = mockRelatedTasksForTimer

    it("test normal ", async () => {

        wrapper = mount(
            <TimerDetailInfo
                timer = {mockTimer}
                relatedTasklists = {relatedTasks}
                attrNameSize='medium'
                contentSize='medium'
                hideTasks = {false}
                color = 'red'/>
         );


            expect(wrapper.find({name: "Related Tasks"}).length).toEqual(1);
    });

    it("test hide mode ", async () => {

        wrapper = mount(
            <TimerDetailInfo
                timer = {mockTimer2}
                relatedTasklists = {relatedTasks}
                hideTasks = {true}/>
         );


            expect(wrapper.find({name: "Related Tasks"}).length).toEqual(0);
    });


});
