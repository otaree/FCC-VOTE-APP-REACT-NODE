import * as  constants from '../actions/constants';

const initialState = {
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

export default (state=initialState, action) => {
    switch (action.type) {
        case constants.AUTH_LOADING:
            return {
                ...state,
                loading: action.loading
            }
        case constants.AUTH_LOGIN:
            return {
                ...state,
                loading: action.loading,
                error: action.error,
                userId: action._id,
                name: action.name,
                email: action.email,
                token: action.token
            };
        case constants.AUTH_FAIL:
            return {
                ...state,
                loading: action.loading,
                error: action.error
            };
        case constants.AUTH_LOGOUT:
            return {
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
        default: 
            return state;
    }
}