import React from 'react';
import { shallow } from 'enzyme';

import { EditPoll } from './EditPoll';

describe("EditPoll", () => {
    const editPoll = shallow(<EditPoll />);

    it("renders correctly", () => {
        expect(editPoll).toMatchSnapshot();
    });
});