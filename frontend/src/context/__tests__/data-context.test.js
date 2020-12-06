import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { act } from 'react-dom/test-utils';
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import fetchMock from 'fetch-mock-jest';
import { mockTimerArray, mockTaskArray, mockTaskListArray } from '../../utilities/mockData';
import { SERVER_URL } from '../../constants/constants';
import { DataContext, DataContextProvider}from '../data-context';
import { GoogleAuthContext } from '../google-login-context';
// import { DataContextProvider } from '../data-context';

configure({ adapter: new Adapter() });


describe("test data context", ()=>{
    const mockUserId = "0";
    const getAllTimerRoute = `${SERVER_URL}/timerToUser/?userId=${mockUserId}`;
    const getAllTaskRoute = `${SERVER_URL}/tasks?userId=${mockUserId}`;
    const getAllTasklistRoute =  `${SERVER_URL}/tasklists?userId=${mockUserId}`;

    let wrapper;

    beforeEach(async ()=>{
        fetchMock.get(getAllTimerRoute, {
            code: 200,
            message: "success",
            data: mockTimerArray,
        });
        fetchMock.get(getAllTaskRoute,{
            code: 200,
            message: "success",
            data: mockTaskArray,
        });
        fetchMock.get(getAllTasklistRoute, {
            code: 200,
            message: "success",
            data: mockTaskListArray,
        });
    
        await act(async ()=>{
            wrapper = mount(<GoogleAuthContext.Provider
                value={{
                    isSignedIn: true,
                    googleUser: {googleId: mockUserId},
                }}
            >
                <DataContextProvider>
                    <div/>
                </DataContextProvider>
            </GoogleAuthContext.Provider>);
            
        })
    });


    it('test', ()=>{
        console.log(wrapper.debug());
        console.log(wrapper.find('DataContextProvider').props());
    }); 
});