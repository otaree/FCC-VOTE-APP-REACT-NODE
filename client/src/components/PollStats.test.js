import React from 'react';
import { shallow } from 'enzyme';

import PollStats from './PollStats';
import { polls } from '../store/actions/seed';

describe("PollStats", () => {
    const props = {
        poll: polls[0]
    };

    const pollStats = shallow(<PollStats {...props} />);

    it('renders correctly', () => {
        expect(pollStats).toMatchSnapshot();
    });
});