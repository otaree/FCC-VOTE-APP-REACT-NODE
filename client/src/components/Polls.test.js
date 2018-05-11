import React from 'react';
import { shallow } from 'enzyme';

import { Polls } from './Polls';


describe("Poll", () => {
    const mockFetchPolls = jest.fn();
    const polls = [];
    const props = {
        fetchPolls: mockFetchPolls,
        polls
    };
    const poll = shallow(<Polls {...props} />);

    it('renders correctly', () => {
        expect(poll).toMatchSnapshot();
    });
});