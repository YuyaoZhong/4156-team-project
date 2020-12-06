import React from 'react'
import 'jest-enzyme';
import Enzyme, { shallow, mount} from 'enzyme'
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import renderer from 'react-test-renderer';
import { DataContext} from '../../../context/data-context';
import {DisplayTimer} from '../../timers/timer-info';
import {DisplayTimerArea} from '../../timers/timer-info';
import {SingleTimer} from '../../timers/timer-info';


configure({ adapter: new Adapter() });

describe("test <DisplayTimer/>", () => {
    // mockDisplayTimer;

});
