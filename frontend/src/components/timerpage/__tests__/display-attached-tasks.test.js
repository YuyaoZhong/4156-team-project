import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { mockRelatedTasksForTimer } from '../../../utilities/mockData';
import AttachedTasks from '../display-attached-tasks';

configure({ adapter: new Adapter() });


describe("test <AttachedTasks/>", ()=>{

    let wrapper;

    it('hide border and close ', async ()=>{

        wrapper = mount(<AttachedTasks
            data = {mockRelatedTasksForTimer}
            noBorder = {true}
            hideRemove = {true}
            selectHandler = {jest.fn()}
        />)
        
        const noBorderLable = wrapper.find({className:  "no-border-label"});
        expect(noBorderLable).toExist();

        const removeIcon = wrapper.find({name: "close"});
        expect(removeIcon).not.toExist();
    });


    it('show border and show close ', async ()=>{

        wrapper = mount(<AttachedTasks
            data = {mockRelatedTasksForTimer}
            noBorder = {false}
            hideRemove = {false}
            selectHandler = {jest.fn()}
        />)
        
        const noBorderLable = wrapper.find({className:  "no-border-label"});
        expect(noBorderLable).not.toExist();

        const removeIcon = wrapper.find({name: "close"});
        expect(removeIcon).toExist();
    })


});