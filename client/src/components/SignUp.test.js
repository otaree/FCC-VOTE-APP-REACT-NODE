import React from 'react';
import { shallow, mount } from 'enzyme';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

import { SignUp } from './SignUp';

// jest.mock('axios', () => {
//     const exampleArticles = [
//         { title: 'test article', url: 'test url' }
//       ];

//     return {
//         post:  jest.fn(() => Promise.resolve(exampleArticles)),
//     }
// });

// const axios = require('axios');

describe('SignUp', () => {
    let mock;
    const mockSignUp = jest.fn();
    const mockSignUpFail = jest.fn();
    const mockPush = jest.fn();

    let props = {
        signUp: mockSignUp,
        signUpFail: mockSignUpFail,
        history: {
            push: mockPush
        },
        authError: {
            isError: false,
            value: ''
        }
    }
    let signUp = shallow(<SignUp {...props} />);

    it('should renders correctly', () => {
        expect(signUp.find('.auth-server-fail').length).toEqual(0);        
        expect(signUp).toMatchSnapshot();
    });

    describe('When from fields value changes', () => {
        beforeEach(() => {
            signUp = shallow(<SignUp {...props} />);
        });

        it('should set username on input change', () => {
            const value = "Test";
            signUp.find('input').at(0).simulate('change', {
                target: { value }
            });
            expect(signUp.state('username').value).toEqual(value);
        });

        it('should set email on input change', () => {
            const value = "test@test.com";
            signUp.find('input').at(1).simulate('change', {
                target: { value }
            });
            expect(signUp.state('email').value).toEqual(value);
        });

        it('should set password on input change', () => {
            const value = "password!";
            signUp.find('input').at(2).simulate('change', {
                target: { value }
            });
            expect(signUp.state('password').value).toEqual(value);
        });

        it('should set password2 on input change', () => {
            const value = "password!";
            signUp.find('input').at(3).simulate('change', {
                target: { value }
            });
            expect(signUp.state('password2').value).toEqual(value);
        });
    });

    describe('when authentication Error', () => {
        beforeEach(() => {
            props.authError.isError = true;
            props.authError.value = "Authentication Error";
            signUp = shallow(<SignUp {...props} />);
        });

        it('should render the error message', () => {
            expect(signUp.find('.auth-error').length).toEqual(1);
        });
    });

    // describe('when valid form submission', () => {
    //     beforeEach(() => {
    //         signUp = shallow(<SignUp {...props} />);
    //         mock = new MockAdapter(axios);
    //     });

    //     it('should submit the from correctly', () => {
    //         const user = {
    //             name: "Test",
    //             email: "test@test.com",
    //             password: "password"
    //         };  

    //         signUp.setState({ username: { value: user.name, error: false }});
    //         signUp.setState({ email: { value: user.email, error: false }});
    //         signUp.setState({ password: { value: user.password, error: false }});
    //         signUp.setState({ password: { value: user.password2, error: false }});
    //         signUp.find('form').simulate('submit', {
    //             preventDefault: () => {}
    //         });

    //         expect(mockSignUpFail).toHaveBeenCalled();
                      
    //     });
    // });
});