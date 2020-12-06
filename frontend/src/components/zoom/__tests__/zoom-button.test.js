import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { mockRelatedTasksForTimer } from '../../../utilities/mockData';
import ZoomButton from '../zoom-button';

configure({ adapter: new Adapter() });


describe("test <Zoom Button/>", ()=>{

    let wrapper;

    it('show link', async ()=>{
        wrapper = mount(<ZoomButton
            timeId = "0"
            link = "https://localhost: 3000"
        />)

        expect(wrapper.find('button').text()).toEqual('Join Zoom Meeting');
    });


    it('no link', async ()=>{
        wrapper = mount(<ZoomButton
            timeId = "0"
            link = "None"
        />)

        expect(wrapper.find('button').text()).toEqual('Add a Zoom Session');
    });


});