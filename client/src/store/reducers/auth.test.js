import * as constants from '../actions/constants';
import authReducer from './auth';

describe('authReducer', () => {
    let initialState = {
        token: null,
        userId: null,
        name: null,
        email: null,
        error: {
            isError: false,
            value: ''
        },
        loading: false
    };

    it('should set loading', () => {
        expect(authReducer(initialState, {
            type: constants.AUTH_LOADING,
            loading: true
        })).toEqual({
            ...initialState,
            loading: true
        });
    });

    it('should set userId, token', () => {
        const _id = "1";
        const name = "Test";
        const email = "test@test.com"
        const token = '123abc';

        expect(authReducer(initialState, {
            type: constants.AUTH_LOGIN,
            _id,
            name,
            email,
            token,
            loading: false,
            error: {
                isError: false,
                value: ''
            }
        })).toEqual({
            ...initialState,
            userId: _id,
            name,
            email,
            token
        })
    });
});

