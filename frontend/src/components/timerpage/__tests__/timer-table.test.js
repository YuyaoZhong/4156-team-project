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
import TimerTable from '../timers-table';
import TimerForm from '../timer-form';
configure({ adapter: new Adapter() });

jest.mock('../timer-form', ()=>()=><div/>);

describe("test <TimerTable/>", ()=>{

    let wrapper;
    let handleDeleteTimer;


    beforeEach(()=>{
        handleDeleteTimer = jest.fn();
        wrapper = mount(<Router>
            <DataContext.Provider value = {{
                timerList: mockTimerArray,
                handleDeleteTimer: handleDeleteTimer,
        }}
         >
            <TimerTable/>
        </DataContext.Provider>
        </Router>)
    });


    it('test select delete', async ()=>{
        let deleteModeButton = wrapper.find({color: 'grey'});

        expect(wrapper.find({type: "checkbox"})).not.toExist();
        // console.log(wrapper.find('ForwardRef').debug());
        await act(async()=>{
            await deleteModeButton.simulate('click');
            wrapper = wrapper.update();
        })
        
        expect(wrapper.find({type: "checkbox"})).toExist();
    
        let deleteButton = wrapper.find({color: 'red'});
    
        await act(async()=>{
            // await deleteModeButton.simulate('click');
           await wrapper.find({type: "checkbox"}).at(0).simulate('click');
           await deleteButton.simulate('click');
        })

        expect(handleDeleteTimer).toHaveBeenCalled();

    });


    it('test add new timer', async ()=>{
        let addButton = wrapper.find('button').at(0);

        expect(wrapper.find('table')).toExist();
        // console.log(wrapper.find('ForwardRef').debug());
        await act(async()=>{
            await addButton.simulate('click');
            wrapper = wrapper.update();
        })

        expect(wrapper.find('table')).not.toExist();

    });

    

});