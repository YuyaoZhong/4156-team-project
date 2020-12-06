import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import ShareButton from "../../timers/share-button";


configure({ adapter: new Adapter() });

describe("test <ShareButton/>", () => {
    // mockShareButton;
    let wrapper;

    // it("test click shareButton and wait", async () => {
    //
    //     wrapper = mount(<DataContext.Provider>
    //         <ShareButton timerId = '111' userId = 'test' />
    //     </DataContext.Provider>);
    //     wrapper.find({color:'grey', floated:'right', size:'big'}).at(0).simulate('click');
    //     wrapper.update();
    //     jest.advanceTimersByTime(3000);
    //     wrapper.update();
    //     expect(wrapper.find({position:'bottom center'}).length).toEqual(0);
    // });

    it("test click shareButton twice", async () => {

        wrapper = mount(<DataContext.Provider>
            <ShareButton timerId = '111' userId = 'test' />
        </DataContext.Provider>);
        wrapper.find({color:'grey', floated:'right', size:'big'}).at(0).simulate('click');
        wrapper.update();
        wrapper.find({color:'grey', floated:'right', size:'big'}).at(0).simulate('click');
        wrapper.update();
        expect(wrapper.find({position:'bottom center'}).length).toEqual(1);
    });

});

