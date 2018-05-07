import React from 'react';
import { shallow } from 'enzyme';

import Main from './Main';

describe('Main', () => {
    const main = shallow(<Main />);

    it('renders correctly', () => {
        expect(main).toMatchSnapshot();
    });
});