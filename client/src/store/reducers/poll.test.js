import * as constants from '../actions/constants';
import pollReducer from './poll'

import { polls } from '../actions/seed';

describe("pollReducer", () => {
   const initialState = {
        loading: false,
        error: {
            isError: false,
            value: ''
        },
        polls: [],
        poll: {}
    };

    it('should set loading', () => {
        expect(pollReducer(initialState, { type: constants.POLL_LOADING, loading: true})).toEqual({
            ...initialState,
            loading: true
        });
    });

    it('should set success', () => {
        expect(pollReducer({
            ...initialState,
            loading: true,
            error: {
                isError: true,
                value: "Network Problem"
            }
        }, {
            type: constants.POLL_SUCCESS,
            loading: false,
            error: {
                isError: false,
                value: ''
            }
        })).toEqual(initialState);
    });

    it('should set error', () => {
        expect(pollReducer(initialState, {
            type: constants.POLL_FAIL,
            loading: false,
            error: {
                isError: true,
                value: "Network Problem"
            }
        })).toEqual({
            ...initialState,
            loading: false,
            error: {
                isError: true,
                value: "Network Problem"
            }
        })
    });

    it('should set polls', () => {
        expect(pollReducer(initialState, {
            type: constants.POLL_SET_POLLS,
            loading: false,
            error: {
                isError: false,
                value: ''
            },
            polls
        })).toEqual({
            ...initialState,
            polls
        });
    });

    it('should set poll', () => {
        expect(pollReducer(initialState, {
            type: constants.POLL_SET,
            loading: false,
            error: {
                isError: false,
                value: ''
            },
            poll: polls[0]
        })).toEqual({
            ...initialState,
            poll: polls[0]
        });
    });
});