import React from 'react';
import { shallow } from 'enzyme';

import { App } from './App';

describe('APP', () => {
    const app = shallow(<App />);

    it('should render correctly', () => {
        expect(app).toMatchSnapshot();
    });
});