import React from 'react'
import 'jest-enzyme';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { DataContext} from '../../../context/data-context';
import { mockTimerArray } from '../../../utilities/mockData';
// import TimelineBoard from '../timer-board';
import Timeline from '../time-line';

configure({ adapter: new Adapter() });


describe("test <Timeline/>", ()=>{

    let wrapper;

    it('test without default attributes', async ()=>{
        const props = {
            direction: 'left',
            icon: 'clock',
            description: "",
            time: "TEST TIME"
        }

        wrapper = mount(<Router>
            <Timeline {...props}/>
        </Router>);
       expect(wrapper.find({className: "Timeline-line"})).toExist();
    });


    it('test mobile display', async ()=>{
        const props = {
            direction: 'left',
            icon: 'clock',
            description: "",
            time: "TEST TIME"
        }

         // Change the viewport to 500px.
        global.innerWidth = 500;

        // Trigger the window resize event.
        global.dispatchEvent(new Event('resize'));


        wrapper = mount(<Router>
            <Timeline {...props}/>
        </Router>);
       
       expect(wrapper.find('Icon').prop('size')).toEqual('small');
    });


    
    
});