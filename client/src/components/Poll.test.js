import React from 'react';
import { shallow } from 'enzyme';

import { Poll } from './Poll';
import { polls } from '../store/actions/seed';

describe("Poll", () => {
    const props = {
        poll: polls[0]
    };
    const poll = shallow(<Poll {...props} />);

    it('renders correctly', () => {
        expect(poll).toMatchSnapshot();
    });
});