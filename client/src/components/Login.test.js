import React from 'react';
import { shallow, mount } from 'enzyme';


import { Login } from './Login';

describe('SignUp', () => {
    let mock;
    const mockLogin = jest.fn();
    const mockLoginFail = jest.fn();
    const mockPush = jest.fn();

    let props = {
        signUp: mockLogin,
        signUpFail: mockLoginFail,
        history: {
            push: mockPush
        },
        authError: {
            isError: false,
            value: ''
        }
    }
    let login = shallow(<Login {...props} />);

    it('should renders correctly', () => {
        expect(login.find('.auth-server-fail').length).toEqual(0);        
        expect(login).toMatchSnapshot();
    });

    describe('When from fields value changes', () => {
        beforeEach(() => {
            login = shallow(<Login {...props} />);
        });

        it('should set email on input change', () => {
            const value = "test@test.com";
            login.find('input').at(0).simulate('change', {
                target: { value }
            });
            expect(login.state('email').value).toEqual(value);
        });

        it('should set password on input change', () => {
            const value = "password!";
            login.find('input').at(1).simulate('change', {
                target: { value }
            });
            expect(login.state('password').value).toEqual(value);
        });
    });

    describe('when authentication Error', () => {
        beforeEach(() => {
            props.authError.isError = true;
            props.authError.value = "Authentication Error";
            login = shallow(<Login {...props} />);
        });

        it('should render the error message', () => {
            expect(login.find('.auth-error').length).toEqual(1);
        });
    });
});