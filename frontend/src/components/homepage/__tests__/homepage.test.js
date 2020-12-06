import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { DataContext} from '../../../context/data-context';
import { GoogleAuthContext } from '../../../context/google-login-context';
import HomepageHeading from '../homepage';

configure({ adapter: new Adapter() });



describe("test home page ", ()=>{
    const mockUserId = "0";
    let wrapper;

    it('test with login ', async ()=>{

        // console.log(wrapper.debug());

        const elementwithProvider = (<Router>
            <GoogleAuthContext.Provider
             value={{
                 isSignedIn: true,
                 signIn: jest.fn(),
             }}
            >
                <HomepageHeading/>
            </GoogleAuthContext.Provider>
        </Router>
         )
        
 
         wrapper = mount(elementwithProvider);

         const googleLoginButton = wrapper.find('GoogleButton').find('button');
         expect(googleLoginButton.text()).toEqual('Get Started!');
        
    });


    
    it('test without login ', async ()=>{

        // console.log(wrapper.debug());

        const elementwithProvider = (<Router>
            <GoogleAuthContext.Provider
             value={{
                 isSignedIn: false,
                 signIn: jest.fn(),
             }}
            >
                <HomepageHeading/>
            </GoogleAuthContext.Provider>
        </Router>
         )
        
 
         wrapper = mount(elementwithProvider);

         const googleLoginButton = wrapper.find('GoogleButton').find('button');
         expect(googleLoginButton.text()).toEqual('Sign In With Google Account');
        
    });


    it('test mobile rendering ', async ()=>{

        // console.log(wrapper.debug());

        const elementwithProvider = (<Router>
            <GoogleAuthContext.Provider
             value={{
                 isSignedIn: false,
                 signIn: jest.fn(),
             }}
            >
                <HomepageHeading mobile ={true}/>
            </GoogleAuthContext.Provider>
        </Router>
         )
        
 
         wrapper = mount(elementwithProvider);

         const googleLoginButton = wrapper.find('GoogleButton').find('button');
         expect(googleLoginButton.text()).toEqual('Sign In With Google Account');
        
    });
    

    



});