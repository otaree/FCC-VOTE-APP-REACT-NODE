import axios from 'axios';
import uniqid from 'uniqid';

import * as constants from './constants';

export const loading = () => {
    return {
        type: constants.AUTH_LOADING,
        loading: true
    };
};

export const login = (user) => {
    return {
        ...user,
        loading: false,
        error: {
            isError: false,
            value: ''
        },
        type: constants.AUTH_LOGIN
    }
};

export const logout = () => {
    return {
        type: constants.AUTH_LOGOUT,
        loading: false,
        error: {
            isError: false,
            value: ''
        }
    };
};

export const fail = (value) => {
    return {
        type: constants.AUTH_FAIL,
        loading: false,
        error: {
            isError: true,
            value
        }
    };
};

export const initUser = (token) => {
    return async dispatch => {
        dispatch(loading());
        try {
            const response = await axios({ url: 'http://localhost:5000/user/token', method: 'get', headers: { 'x-auth': token }});
            dispatch(login(response.data));
        } catch (e) {
            dispatch(fail("Authentication fail"));
        }
    };
};

export const getUid = () => {
    let uid = localStorage.getItem("uid");
    if (!uid) {
        uid = uniqid();
        localStorage.setItem("uid", uid)
    }
    return {
        type: constants.AUTH_GET_UID,
        uid
    }
};