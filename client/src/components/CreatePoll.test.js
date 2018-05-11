import React from 'react';
import { shallow } from 'enzyme';

import { CreatePoll } from './CreatePoll';

describe('CreatePoll', () => {
    const createPoll = shallow(<CreatePoll />);

    it('renders correctly', () => {
        expect(createPoll).toMatchSnapshot();
    });
});