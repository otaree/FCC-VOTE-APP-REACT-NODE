import React from 'react';
import { shallow } from 'enzyme';

import { CreatePoll } from './CreatePoll';

describe('CreatePoll', () => {
    let createPoll = shallow(<CreatePoll />);

    it('renders correctly', () => {
        expect(createPoll).toMatchSnapshot();
    });

    describe("when form field value changes", () => {
        beforeEach(() => {
            createPoll = shallow(<CreatePoll />);
        });

        it('should set question on input change', () => {
            const value = "New Question";
            createPoll.find('input').at(0).simulate('change', {
                target: { value }
            });
            expect(createPoll.state('question')).toEqual(value);
        });

        it('should set option on input change', () => {
            const value = "option 1";
            createPoll.find('input').at(1).simulate('change', {
                target: { value }
            });
            expect(createPoll.state('options')[0].value).toEqual(value);
        });
    });

    describe("when add option button clicked", () => {
        beforeEach(() => {
            createPoll = shallow(<CreatePoll />);
        });

        it('should add options', () => {
            createPoll.find('.addOption__btn').simulate('click', {
                preventDefault: () => {}
            });
            expect(createPoll.state('options').length).toEqual(3);
        });
    });

    describe("when submitting the form", () => {
        const mockPush = jest.fn();
        const mockCreatePoll = jest.fn();
        const token = "123abc!";
        beforeEach(() => {
            const props = {
                createPoll: mockCreatePoll,
                token,
                history: {
                    push: mockPush
                }
            };

            createPoll = shallow(<CreatePoll {...props} />);
        });

        it('should call `createPoll` on submit', () => {
            const question = "Yes or No?";
            const options = [ { value: "Yes" }, { value: "Yes" } ];

            createPoll.setState({ question, options });
            createPoll.find("form").simulate("submit", {
                preventDefault: () => {}
            });
            expect(mockCreatePoll).toHaveBeenCalledWith({ question, options}, token);
        });
    });
});