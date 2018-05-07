import React from 'react';
import { shallow } from 'enzyme';

import { Logout } from './Logout';

describe("Logout", () => {
    const props = {
        error: {
            isError: false
        }
    }
    const logout = <Logout {...props} />;

    it('renders correctly', () => {
        expect(logout).toMatchSnapshot();
    });
});