import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import { act } from 'react-dom/test-utils';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import ShareButton from "../../timers/share-button";


configure({ adapter: new Adapter() });

describe("test <ShareButton/>", () => {
    // mockShareButton;
    let wrapper;
    const messageLocator = { className: "ui bottom center popup transition visible"};

    beforeEach(()=>{
        jest.spyOn(window, 'prompt').mockImplementation(() => {});
    });

    it("test click shareButton and wait", async () => {
    
        jest.useFakeTimers();
        wrapper = mount(<ShareButton timerId = '111' userId = 'test' />);

        expect(wrapper.find(messageLocator)).not.toExist();

        await act(async ()=>{
            await wrapper.find({color:'grey', floated:'right', size:'big'}).at(0).simulate('click');
            wrapper = wrapper.update();
       });

       expect(wrapper.find(messageLocator)).toExist();

        await act(async ()=>{
            jest.advanceTimersByTime(3000);
            wrapper = wrapper.update();
        });

        expect(wrapper.find(messageLocator)).not.toExist();
    });

    it("test click shareButton twice", async () => {
      
        wrapper = mount(<ShareButton timerId = '111' userId = 'test' />);
       
            expect(wrapper.find(messageLocator)).not.toExist();
       
        await act(async ()=>{
            await wrapper.find({color:'grey', floated:'right', size:'big'}).at(0).simulate('click');
            wrapper = wrapper.update();
       });

       expect(wrapper.find(messageLocator)).toExist();

       await act(async()=>{
            await wrapper.find({color:'grey', floated:'right', size:'big'}).at(0).simulate('click');
            wrapper = wrapper.update();
       });

       expect(wrapper.find(messageLocator)).not.toExist();
        
    });

});

