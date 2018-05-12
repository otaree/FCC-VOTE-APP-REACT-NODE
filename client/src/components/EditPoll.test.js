import React from 'react';
import { shallow } from 'enzyme';

import { EditPoll } from './EditPoll';
import { polls } from '../store/actions/seed';

describe("EditPoll", () => {
    let editPoll = shallow(<EditPoll />);

    it("renders correctly", () => {
        expect(editPoll).toMatchSnapshot();
    });

    describe("when form field value changes", () => {
        beforeEach(() => {
            editPoll = shallow(<EditPoll />);
            editPoll.setState({
                add: [],
                remove: [],
                poll: polls[0]
            });
        });

        it('should set question on input change', () => {
            
            const value = "New Question";
            editPoll.find('input').at(0).simulate('change', {
                target: { value }
            });
            expect(editPoll.state('poll').question).toEqual(value);
        });

        it('should set option on input change', () => {            
            const value = "option 1";
            editPoll.find('input').at(1).simulate('change', {
                target: { value }
            });
            expect(editPoll.state('poll').options[0].value).toEqual(value);
        });
    });

    describe("when add option button clicked", () => {
        beforeEach(() => {
            editPoll = shallow(<EditPoll />);
            editPoll.setState({
                add: [],
                remove: [],
                poll: polls[0]
            });
        });

        it('should add option', () => {
            editPoll.find('.addOption__btn').simulate('click', {
                preventDefault: () => {}
            });
            expect(editPoll.state('poll').options.length).toEqual(3);
        });
    });

    describe("when remove option button is clicked", () => {
        beforeEach(() => {
            editPoll = shallow(<EditPoll />);
            editPoll.setState({
                add: [],
                remove: [],
                poll: polls[0]
            });
        });

        it("should remove option", () => {
            editPoll.find(".remove__option").at(0).simulate("click", {
                preventDefault: () => {}
            });
            expect(editPoll.state('poll').options.length).toEqual(1);
            expect(editPoll.state('remove').length).toEqual(1);
        });
    });

    describe("when submitting form", () => {
        const mockUpdatePoll = jest.fn();
        const mockPush = jest.fn();
        const token = '123abc!';
        const id = "1000";
        const props = {
            updatePoll: mockUpdatePoll,
            token,
            match: {
                params: {
                    id
                }
            },
            history: {
                push: mockPush
            }
        };
        beforeEach(() => {
            // this.props.match.params.id;
            editPoll = shallow(<EditPoll {...props} />);
            editPoll.setState({
                add: [],
                remove: [],
                poll: polls[0]
            });
        });

        it('should correctly submit the form', () => {
            editPoll.find(".remove__option").at(0).simulate("click", {
                preventDefault: () => {}
            });
            editPoll.find("form").simulate("submit", {
                preventDefault: () => {}
            });
            
            expect(mockUpdatePoll).toHaveBeenCalledWith({
                add: null,
                remove: [polls[0].options[0]]
            }, token, id);
        });
    });
});