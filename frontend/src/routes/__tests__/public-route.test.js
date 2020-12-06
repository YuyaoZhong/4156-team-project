import React from 'react'
import { MemoryRouter, BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { GoogleAuthContext } from '../../context/google-login-context';
import PublicRoute from '../PublicRoute';

configure({ adapter: new Adapter() });



jest.mock('react-router-dom', ()=>({
    ...jest.requireActual('react-router-dom'),
    BrowserRouter: ({children}) => (<div>{children}</div>),
    Route: ({render}) => (<div>{render()}</div>),
    Redirect: () => (<div>Public page</div>)
}));



describe("test public route", ()=>{
    const mockUserId = "0";  
    const TestComponent = () => {
        return(<div name="test">
            test component
        </div>)
    }
    let wrapper;

    it('test with login ', async ()=>{

        const elementwithProvider = (
            <GoogleAuthContext.Provider
             value={{
                 isSignedIn: true,
                 
             }}
            >  <PublicRoute
                    path = "/test"
                    component = {TestComponent}
                />
            </GoogleAuthContext.Provider>
     
         )
        
 
         wrapper = mount(elementwithProvider);
        expect(wrapper.find({name: "test"})).not.toExist();
        expect(wrapper.find('Redirect')).toExist();
        
    });


    it('test without login ', async ()=>{

        const elementwithProvider = (
            <GoogleAuthContext.Provider
             value={{
                 isSignedIn: false,
                 
             }}
            >  <PublicRoute
                    path = "/test"
                    component = {TestComponent}
                />
            </GoogleAuthContext.Provider>
     
         )
        
 
        wrapper = mount(elementwithProvider);

        expect(wrapper.find({name: "test"})).toExist();
        expect(wrapper.find('Redirect')).not.toExist();
        
    });


    






});