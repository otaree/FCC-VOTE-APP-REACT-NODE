import * as constants from '../actions/constants';

const initialState = {
    loading: false,
    error: {
        isError: false,
        value: ''
    },
    polls: [],
    poll: {}
};


export default (state=initialState, action) => {
    switch (action.type) {
        case constants.POLL_LOADING:
            return {
                ...state,
                loading: action.loading
            };
        case constants.POLL_SUCCESS:
            return {
                ...state,
                loading: action.loading,
                error: action.error
            };
        case constants.POLL_FAIL:
            return {
                ...state,
                loading: action.loading,
                error: action.error
            };
        case constants.POLL_SET_POLLS:
            return {
                ...state,
                loading: action.loading,
                error: action.error,
                polls: action.polls
            };
        case constants.POLL_SET:
            return {
                ...state,
                loading: action.loading,
                error: action.error,
                poll: action.poll
            };
        default:
            return state;
    } 
};