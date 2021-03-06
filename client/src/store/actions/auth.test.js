import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as constants from './constants';
import * as actions from './auth';

let createMockStore, mock, store, initialState;
describe('Auth Actions', () => {
    initialState = {
        token: null,
        uid: null,
        userId: null,
        name: null,
        error: {
            isError: false,
            value: ''
        },
        loading: false
    };

    it('should generate loading action', () => {
        const action = actions.loading();
        expect(action).toEqual({
            type: constants.AUTH_LOADING,
            loading: true
        });
    });

    // it('should generate login action', () => {
    //     const user = {
    //         name: "Test",
    //         email: "test@test.com",
    //         _id: "1"
    //     };

    //     const action = actions.login(user);
    //     expect(action).toEqual({
    //         ...user,
    //         loading: false,
    //         error: {
    //             isError: false,
    //             value: ''
    //         },
    //         type: constants.AUTH_LOGIN
    //     });
    // });

    // it('should generate logout action', () => {
    //     const action = actions.logout();
    //     expect(action).toEqual({
    //         type: constants.AUTH_LOGOUT,
    //         loading: false,
    //         error: {
    //             isError: false,
    //             value: ''
    //         }
    //     });
    // });

    it('should generate auth fail action', () => {
        const value = "AUTH FAIL";
        const action = actions.fail(value);
        expect(action).toEqual({
            type: constants.AUTH_FAIL,
            loading: false,
            error: {
                isError: true,
                value
            }
        });
    });

    // it('should denerate auth uid action', () => {
    //     const action = actions.getUid();
    //     expect(action.type).toEqual(constants.AUTH_GET_UID);
    //     expect(action.uid).toBeTruthy();
    // });

});