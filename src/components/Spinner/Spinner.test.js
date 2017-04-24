import React from 'react';
import { shallow } from 'enzyme';
import Spinner from './Spinner';

describe('basic', () => {
    it('renders without crashing', () => {
        shallow(<Spinner />);
    });

    it('should have className spinner', () => {
        // enzyme https://github.com/airbnb/enzyme#basic-usage
        const wrapper = shallow(<Spinner />);
        expect(wrapper.hasClass('spinner')).toBeTruthy();
    });

    it('should change style depending on size prop', () => {
        const wrapper = shallow(<Spinner size={50} />);
        // toHaveStyle are addon matchers from jest-enzyme package:
        // https://github.com/blainekasten/enzyme-matchers#assertions
        expect(wrapper).toHaveStyle('width', '50px');
        expect(wrapper).toHaveStyle('height', '50px');
    });
});
