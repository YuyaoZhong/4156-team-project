import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import {TimerDetailAttr} from '../../timers/timer-detail-info';
import {TimerDetailInfo} from '../../timers/timer-detail-info';
import {mockRelatedTasksForTimer} from '../../../utilities/mockData';
import {mockEditTimer} from '../../../utilities/mockData';


configure({ adapter: new Adapter() });

// describe("test <TimerDetailAttr/>", () => {
//     // mockTimerDetail;
//     let wrapper;
//
//     it("test huge size ", async () => {
//
//         wrapper = mount(
//             <TimerDetailAttr name = {"test"} size = {"huge"} />
//         );
//         expect(wrapper.find({size: "huge"}).length).toEqual(2);
//     });
//
//     it("test small size ", async () => {
//
//         wrapper = mount(
//             <TimerDetailAttr name = {"test"} />
//         );
//         expect(wrapper.find({size: "huge"}).length).toEqual(1);
//     });
//
// });

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
        startTime: "2023-12-03T20:50:00.000Z",
        timerToUserId: "0",
        title: "test shared timer",
        userId: "-1",
        zoomLink: "None"
    }
    const relatedTasks = mockRelatedTasksForTimer

    it("test normal ", async () => {

        wrapper = mount(
            <TimerDetailInfo timer = {mockTimer} relatedTasklists = {relatedTasks}
            attrNameSize = {"huge"} contentSize = {"large"} hideTasks = {false} color = {"red"}/>);
        expect(wrapper.find({name: "Related Tasks"}).length).toEqual(1);
    });


});
