import axios from '../../axios-poll';

import * as constants from './constants';

export const pollLoading = () => ({
    type: constants.POLL_LOADING,
    loading: true
});

export const pollSuccess = () => ({
    type: constants.POLL_SUCCESS,
    loading: false,
    error: {
        isError: false,
        value: ''
    }
});

export const pollFail = value => ({
    type: constants.POLL_FAIL,
    loading: false,
    error: {
        isError: true,
        value
    }
});

export const setPolls = polls => ({
    type: constants.POLL_SET_POLLS,
    loading: false,
    error: {
        isError: false,
        value: ''
    },
    polls
});

export const setPoll = poll => ({
    type: constants.POLL_SET,
    loading: false,
    error: {
        isError: false,
        value: ''
    },
    poll
});

export const fetchPolls = () => {
    return async dispatch => {
        dispatch(pollLoading());

        try {
            const response = await axios.get('/polls');
            dispatch(setPolls(response.data));
            return Promise.resolve("PASS");
        } catch (e) {
            dispatch(pollFail("Network Problem"));
            return Promise.reject("FAIL");
        }
    }
};


export const fetchPoll = (id) => {
    return async dispatch => {
        dispatch(pollLoading());

        try {
            const response = await axios.get(`/poll/${id}`);
            dispatch(setPoll(response.data));
            return Promise.resolve();
        } catch (e) {
            dispatch(pollFail("Network Problem"));
            return Promise.reject();
        }
    };
};

export const unsetPoll = () => {
    return {
        type: constants.POLL_UNSET
    };
}

export const createPoll = (poll, token) => {
    return async dispatch => {
        dispatch(pollLoading());

        try {
            const response = await axios({ url: "/poll", method: "post", headers: { "x-auth": token }, data: poll });
            dispatch(pollSuccess());
            return response.data;
        } catch (e) {
            dispatch(pollFail("Network Problem"));
            return Promise.reject();
        }
    }
};

export const updatePoll = (poll, token, id) => {
    return async dispatch => {
        dispatch(pollLoading());

        try {
            const response = await axios({ url: `/poll/${id}`, method: "patch", headers: { "x-auth": token }, data: poll });
            dispatch(pollSuccess());
            return response.data;
        } catch (e) {
            dispatch(pollFail("Network Problem"));
            return Promise.reject();
        }
    }
};

export const deletePoll = (token, id) => {
    return async dispatch => {
        dispatch(pollLoading());

        try {
            const response = await axios({ url: `/poll/${id}`, method: "delete", headers: { "x-auth": token } });
            dispatch(pollSuccess());
            return response.data;
        } catch (e) {
            dispatch(pollFail("Network Problem"));
            return Promise.reject();
        }
    }
};

export const votePoll = (id, optionId, uid) => {
    return async dispatch => {
        dispatch(pollLoading());

        try {
            const response = await axios({ url: `/poll/${id}/vote`, method: "patch", data: { option: optionId, uid } });
            dispatch(pollSuccess());
            return response.data;
        } catch (e) {
            dispatch(pollFail("Network Problem"));
            return Promise.reject();
        }
    }
};
