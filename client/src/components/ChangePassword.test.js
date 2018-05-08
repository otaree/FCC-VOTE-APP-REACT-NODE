import React from 'react';
import { shallow } from 'enzyme';

import { ChangePassword } from './ChangePassword';

let props, changePassword;
describe('ChangePassword', () => {
    props = {
        authError: {
            isError: false,
            value: ''
        }
    };
    changePassword = shallow(<ChangePassword {...props} />);

    it('renders correctly', () => {
        expect(changePassword.find('.auth-server-fail').length).toEqual(0); 
        expect(changePassword).toMatchSnapshot();
    });

    describe('When from fields value changes', () => {
        beforeEach(() => {
            changePassword = shallow(<ChangePassword {...props} />);
        });

        it('should set password on input change', () => {
            const value = "password!";
            changePassword.find('input').at(0).simulate('change', {
                target: { value }
            });
            expect(changePassword.state('password').value).toEqual(value);
        });

        it('should set password2 on input change', () => {
            const value = "password!";
            changePassword.find('input').at(1).simulate('change', {
                target: { value }
            });
            expect(changePassword.state('password2').value).toEqual(value);
        });
    });
});