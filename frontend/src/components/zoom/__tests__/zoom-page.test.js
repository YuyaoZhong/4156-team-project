import React from 'react'
import { SERVER_URL } from '../../../constants/constants';
import { useLocation, Redirect} from 'react-router-dom'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import { upsertData, deleteData} from '../../../utilities/apiMethods';
import CreateZoomPage from '../zoom-page';
import { mockEditTimer } from '../../../utilities/mockData';
import fetchMock from 'fetch-mock-jest';
import { act } from '@testing-library/react';

configure({ adapter: new Adapter() });


// jest.mock('../../../utilities/apiMethods', ()=>({
//     upsertData: jest.fn(),
//     deleteData: jest.fn()
// }));


jest.mock('react-router-dom', ()=>({
    useLocation: ()=>({
        pathname: '/zoom',
        search: '?code=test_code'
    }),
    Redirect: () => (<div>Timer Page</div>)
}));


describe("test <CreateZoomPage/>", () => {
    // let mockTask;
    let wrapper;
    let updateTimerListState;

    const waitUntil=  (fnWait) => {
        return new Promise((resolve, reject)=>{
            let count = 0;
            const check = () => {
                if (++count > 20){
                    reject(new TypeError('Timeout'));
                    return;
                }
                if(fnWait()){
                    resolve();
                }
                setTimeout(check, 10);
            }
            check();
        });
    }

    const waitForFetch = async (fetchMock) =>{
        await waitUntil(()=>fetchMock.called());
        await fetchMock.flush();
    }

    const createZoomUrl =  `${SERVER_URL}/zoom?code=test_code`;
    beforeEach(() => {
        updateTimerListState = jest.fn();
        fetchMock.put(createZoomUrl, {
            code: 200,
            message: "success",
            data: {
                timer: mockEditTimer
            }
        });

      });

    afterEach(()=>{
        fetchMock.mockReset();
    })

    it("test render ", async () => {
        wrapper = mount(<DataContext.Provider value = {{
            updateTimerListState: updateTimerListState
         }}
        >
            <CreateZoomPage/>
        </DataContext.Provider>);

        expect(wrapper.find('div')).toExist();
        
        wrapper = wrapper.update();
        // console.log(wrapper.debug());
    });


    it("test redirect ", async () => {
        
    
        await act(async ()=>{
            wrapper = mount(<DataContext.Provider value = {{
                updateTimerListState: updateTimerListState,
             }}
            >
                <CreateZoomPage/>
            </DataContext.Provider>);
        })

        await act(async ()=>{
            await waitForFetch(fetchMock);
            wrapper = wrapper.update();
        });

        expect(wrapper.find('Redirect')).toExist();
        // console.log(wrapper.debug());
    
    });


    it("test fail create", async () => {
        
        fetchMock.mockReset();
        fetchMock.put(createZoomUrl, {
            code: 500,
            message: "fail",
            data: null
        });
    
        await act(async ()=>{
            wrapper = mount(<DataContext.Provider value = {{
                updateTimerListState: updateTimerListState,
             }}
            >
                <CreateZoomPage/>
            </DataContext.Provider>);
        })


        await act(async ()=>{
            await waitForFetch(fetchMock);
            wrapper = wrapper.update();
        });

        expect(wrapper.find('Redirect')).not.toExist();
    
    });




  });