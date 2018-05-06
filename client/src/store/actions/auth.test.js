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

    it('should generate login action', () => {
        const user = {
            name: "Test",
            email: "test@test.com",
            _id: "1"
        };

        const action = actions.login(user);
        expect(action).toEqual({
            ...user,
            loading: false,
            error: {
                isError: false,
                value: ''
            },
            type: constants.AUTH_LOGIN
        });
    });

    it('should generate logout action', () => {
        const action = actions.logout();
        expect(action).toEqual({
            type: constants.AUTH_LOGOUT,
            loading: false,
            error: {
                isError: false,
                value: ''
            }
        });
    });

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

    describe('ASYNC ACTIONS', () => {
        beforeEach(() => {
            createMockStore = configureStore([thunk]);
            mock = new MockAdapter(axios);
            store = createMockStore(initialState);
        });

        it('should generate async init auth action for valid token', () => {
            const token = '123abc!';
            const user = {
                name: 'Test',
                email: 'test@test.com',
                _id: '1'
            };

            const response = user;

            const headers = {
                'x-auth': token
            };

            mock.onGet('http://localhost:5000/user/token').reply(200, response, headers);

            const expectedActions = [
                {
                    type: constants.AUTH_LOADING,
                    loading: true
                },
                {
                    ...user,
                    loading: false,
                    error: {
                        isError: false,
                        value: ''
                    },
                    type: constants.AUTH_LOGIN,                    
                }
            ];

            return store
                    .dispatch(actions.initUser(token))
                    .then(() => {
                        const dispatchedActions = store.getActions();
                        expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                        expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                    })
        });


        it('should generate async init auth action for invalid token', () => {
            const token = '123abc!';
            

            mock.onGet('http://localhost:5000/user/token').reply(400, {}, {});

            const expectedActions = [
                {
                    type: constants.AUTH_LOADING,
                    loading: true
                },
                {
                    type: constants.AUTH_FAIL,
                    loading: false,
                    error: {
                        isError: true,
                        value: "Authentication fail"
                    }
                }
            ];

            return store
                    .dispatch(actions.initUser(token))
                    .then(() => {
                        const dispatchedActions = store.getActions();
                        expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                        expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                    })
        });
    });
});