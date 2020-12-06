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
import NavBar from '../navbar';

configure({ adapter: new Adapter() });



describe("test <NavBar/> ", ()=>{
    const mockUserId = "0";
    let wrapper;

    it('test navbar change', async ()=>{

        // console.log(wrapper.debug());

        const elementwithProvider = (<Router>
            <GoogleAuthContext.Provider
             value={{
                 isSignedIn: true,
                 signIn: jest.fn(),
                 signOut: jest.fn(),
                 googleUser: {
                     googleId: mockUserId,
                     profileObj:{
                         imageUrl: ""
                     }
                 },
             }}
            >
                <NavBar/>
            </GoogleAuthContext.Provider>
        </Router>
         )
        
 
         wrapper = mount(elementwithProvider);


        const secondElement = wrapper.find('MenuItem').at(1);
        expect(secondElement.prop('active')).toEqual(false);

        act(()=>{
            secondElement.simulate('click');
            wrapper = wrapper.update();
        });

        expect(secondElement.prop('active')).toEqual(false);
        
    });


    
    it('test without login', async ()=>{

        // console.log(wrapper.debug());

        const elementwithProvider = (<Router>
            <GoogleAuthContext.Provider
             value={{
                 isSignedIn: false,
                 signIn: jest.fn(),
                 signOut: jest.fn(),
                 googleUser: {
                     googleId: mockUserId,
                     profileObj:{
                         imageUrl: ""
                     }
                 },
             }}
            >
                <NavBar/>
            </GoogleAuthContext.Provider>
        </Router>
         )
        
 
         wrapper = mount(elementwithProvider);
        
        //  console.log(wrapper.debug());
        const googleLoginButton = wrapper.find('GoogleButton').find('button');
        expect(googleLoginButton.text()).toEqual('Sign In');
        
    });

    

    



});