import React from 'react';
import { shallow } from 'enzyme';

import VotePoll from './VotePoll';
import { polls } from '../store/actions/seed';

describe("VotePoll", () => {
    const mockOnVote = jest.fn();
    const props = {
        poll: polls[0],
        onVote: mockOnVote
    };
    let votePoll = shallow(<VotePoll {...props} />);

    it("renders correctly", () => {
        expect(votePoll).toMatchSnapshot();
    });

    describe("when field value changes", () => {
        beforeEach(() => {
            votePoll = shallow(<VotePoll {...props} />);
        });

        it("should set selected value", () => {
            const value = "123abc!";
            votePoll.find('input').at(0).simulate('change', {
                target: { value }
            });

            expect(votePoll.state("selected")).toEqual(value);
        });
    });

    describe("when submitting the form", () => {
        beforeEach(() => {
            votePoll = shallow(<VotePoll {...props}/>);
        });

        it("should correctly submit", () => {
            const value = "123abc!";
            votePoll.setState({ selected: value });
            votePoll.find("form").simulate("submit", {
                preventDefault: () => {}
            });
            expect(mockOnVote).toHaveBeenCalledWith(value);
        });
    });
});