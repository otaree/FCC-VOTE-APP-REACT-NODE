import React from 'react';
import { shallow } from 'enzyme';

import PollsList from './PollsList';
import { polls } from '../store/actions/seed';

describe("PollsList", () => {
    const props = {
        polls
    };
    const pollsList = shallow(<PollsList {...props} />);

    it('renders correctly', () => {
        expect(pollsList.find('Link').length).toEqual(polls.length);
        expect(pollsList).toMatchSnapshot();
    });
});