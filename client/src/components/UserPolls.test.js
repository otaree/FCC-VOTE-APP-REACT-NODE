import React from 'react';
import { shallow } from 'enzyme';

import { UserPolls } from './UserPolls';

describe("UserPolls", () => {
    const userPolls = shallow(<UserPolls />);

    it('renders correctly', () => {
        expect(userPolls).toMatchSnapshot();
    });
});