import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { mockRelatedTasksForTimer } from '../../../utilities/mockData';
import AttachList from '../attach-list';

configure({ adapter: new Adapter() });


describe("test <AttachList/>", ()=>{

    let wrapper;

    beforeEach(async ()=>{
        wrapper = mount(<AttachList
            data = {mockRelatedTasksForTimer}
            renderAttr = "name"
            buttonName = 'Attach Tasks To Timer'
            toggleSelectTask = {jest.fn()}
        />)
    });


    it('show list', async ()=>{

        let listElement = wrapper.find('List');
        expect(listElement).not.toExist();
        await act(async()=>{
            await wrapper.find('button').simulate('click');
            wrapper = wrapper.update();
            listElement = wrapper.find('List');
        })

        expect(listElement).toExist();
        
    })


});