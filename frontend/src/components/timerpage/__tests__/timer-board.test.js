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
import TimelineBoard from '../timer-board';

configure({ adapter: new Adapter() });


describe("test <TimelineBoard/>", ()=>{

    let wrapper;

    it('test too long timer list ', async ()=>{

        expect(mockTimerArray.length).toBeGreaterThan(5);
        act(()=>{
            wrapper =mount(<Router>
                    <DataContext.Provider value = {{
                    incomingTimers: mockTimerArray
                }}
            >
                <TimelineBoard/>
            </DataContext.Provider>
            </Router>)
        });
            // console.log(wrapper.debug())
       expect(wrapper.find('Card')).toHaveLength(5);
    });

    
    it('test on boundary lenght', async ()=>{

        const onBoundaryArray = mockTimerArray.slice(0, 5);
        expect(onBoundaryArray.length).toEqual(5);
        act(()=>{
            wrapper =mount(<Router>
                    <DataContext.Provider value = {{
                    incomingTimers: mockTimerArray
                }}
            >
                <TimelineBoard/>
            </DataContext.Provider>
            </Router>)
        });
            // console.log(wrapper.debug())
       expect(wrapper.find('Card')).toHaveLength(5);
    });



});