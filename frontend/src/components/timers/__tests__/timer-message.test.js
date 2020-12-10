import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import ResponseMessage from '../../timers/timer-message';



configure({ adapter: new Adapter() });

describe("test <ResponseMessage/>", () => {
    // mockTimerMessage;
    let wrapper;
    let handleClose;
    const messageStatus1 = {
        open: true,
        success: true,
    }

    const messageStatus2 = {
        open: true,
        success: false,
    }

    const messageStatus3 = {
        open: true,
        success: "",
    }

    beforeEach(() => {
        handleClose = jest.fn();
    });

    it("test true ", async () => {

        wrapper = mount(
        <ResponseMessage handleClose = {handleClose} messageStatus = {messageStatus1} />
            );
        expect(wrapper.find({className: "ui positive message scale animating in visible transition"}).length).toEqual(1);
    });

    it("test false ", async () => {

        wrapper = mount(
            <ResponseMessage handleClose = {handleClose} messageStatus = {messageStatus2} />
            );
        expect(wrapper.find({className: "ui negative message scale animating in visible transition"}).length).toEqual(1);
    });

    it("test null ", async () => {

        wrapper = mount(
            <ResponseMessage handleClose = {handleClose} messageStatus = {messageStatus3} />
        );
        expect(wrapper.find({className: "ui negative message scale animating in visible transition"}).length).toEqual(0);
        expect(wrapper.find({className: "ui positive message scale animating in visible transition"}).length).toEqual(0);
    });
});

