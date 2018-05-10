import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as constants from './constants';
import * as actions from './poll';
import { polls } from './seed';

let createMockStore, mock, store, initialState;
describe('Poll Actions', () => {
    initialState = {
        loading: false,
        error: {
            isError: false,
            value: ''
        },
        polls: [],
        poll: {}
    };

    it('should generate loading action', () => {
        const action = actions.pollLoading();
        expect(action).toEqual({
            type: constants.POLL_LOADING,
            loading: true
        });
    });

    it('should generate success action', () => {
        const action = actions.pollSuccess();
        expect(action).toEqual({
            type: constants.POLL_SUCCESS,
            loading: false,
            error: {
                isError: false,
                value: ''
            }
        });
    });

    it('should generate error action', () => {
        const value = "Network Problem";
        const action = actions.pollFail(value);
        expect(action).toEqual({
            type: constants.POLL_FAIL,
            loading: false,
            error: {
                isError: true,
                value
            }
        });
    });

    it('should generate set polls action', () => {
        const action = actions.setPolls(polls);
        expect(action).toEqual({
            type: constants.POLL_SET_POLLS,
            loading: false,
            error: {
                isError: false,
                value: ''
            },
            polls
        });
    });

    it('should generate set poll action', () => {
        const action = actions.setPoll(polls[0]);
        expect(action).toEqual({
            type: constants.POLL_SET,
            loading: false,
            error: {
                isError: false,
                value: ''
            },
            poll: polls[0]
        });
    });

    describe('Async actions', () => {
        beforeEach(() => {
            createMockStore = configureStore([thunk]);
            mock = new MockAdapter(axios);
            store = createMockStore(initialState);
        });

        describe("fetchPolls", () => {
            it('should generate async fetch polls action and set the polls', () => {
                const response = polls;
    
                mock.onGet('http://localhost:5000/polls').reply(200, response);
    
                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_SET_POLLS,
                    loading: false,
                    error: {
                        isError: false,
                        value: ''
                    },
                    polls
                }];
    
                return store
                        .dispatch(actions.fetchPolls())
                        .then(() => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                        })
            });
    
    
            it('should generate async fetch polls action and fail', () => {
                const response = polls;
    
                mock.onGet('http://localhost:5000/polls').reply(400, {});
    
                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_FAIL,
                    loading: false,
                    error: {
                        isError: true,
                        value: "Network Problem"
                    }
                }];
    
                return store
                        .dispatch(actions.fetchPolls())
                        .catch(() => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                        })
            });
        });

        describe("fetchPoll", () => {
            it("should generate async fetch poll and success", () => {
                const response = polls[0];

                mock.onGet(`http://localhost:5000/poll/${polls[0]._id}`).reply(200, response);
                
                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_SET,
                    loading: false,
                    error: {
                        isError: false,
                        value: ''
                    },
                    poll: polls[0]
                }];

                return store
                        .dispatch(actions.fetchPoll(polls[0]._id))
                        .then(() => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                        });
            });

            it("should generate async fetch poll and fail", () => {

                mock.onGet(`http://localhost:5000/poll/${polls[0]._id}`).reply(400, {});
                
                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_FAIL,
                    loading: false,
                    error: {
                        isError: true,
                        value: 'Network Problem'
                    }
                }];

                return store
                        .dispatch(actions.fetchPoll(polls[0]._id))
                        .catch(() => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                        });
            });
        });

        describe("createPoll", () => {
            const poll = {
                _id: "3",
                question: "Yay or Nay?",
                createdAt: 1000,
                author: '123abc',
                voters: ["123abc"],
                options: [{
                    votes: 1,
                    value: 'Yay',
                    _id: "301"
                }, {
                    votes: 0,
                    value: 'Nay',
                    _id: "302"
                }]
            };

            it('should generate a async create poll action and success', () => {
                const token = '123abc567lk';
                const response = poll;

                const postData = {
                    question: "Yay or Nay?",
                    options: [{ value: 'Yay' }, { value: "Nay" }]
                }

                mock.onPost("http://localhost:5000/poll").reply(200, response);

                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_SUCCESS,
                    loading: false,
                    error: {
                        isError: false,
                        value: ''
                    }
                }];

                return store
                        .dispatch(actions.createPoll(postData, token))
                        .then((res) => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                            expect(res).toEqual(poll);
                        });
            });

            it('should generate a async create poll action and fail', () => {
                const token = '123abc567lk';

                const postData = {
                    question: "Yay or Nay?",
                    options: [{ value: 'Yay' }, { value: "Nay" }]
                }

                mock.onPost("http://localhost:5000/poll").reply(400, {});

                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_FAIL,
                    loading: false,
                    error: {
                        isError: true,
                        value: 'Network Problem'
                    }
                }];

                return store
                        .dispatch(actions.createPoll(postData, token))
                        .catch(() => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                        });
            });

        });

        describe("updatePoll", () => {
            it('should generate a async update poll action and success', () => {
                const token = '123abc567lk';
                const poll = {...polls[0]};
                poll.options.pop();
                poll.options.push({
                    _id: '1000',
                    value: "Meh",
                    votes: 0
                });
                const response = poll 

                const postData = {
                    add: [{ value: "Meh" }],
                    remove: [{...polls[0].options[1]}]
                }

                mock.onPatch(`http://localhost:5000/poll/${polls[0]._id}`).reply(200, response);

                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_SUCCESS,
                    loading: false,
                    error: {
                        isError: false,
                        value: ''
                    }
                }];

                return store
                        .dispatch(actions.updatePoll(postData, token, polls[0]._id))
                        .then((res) => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                            expect(res).toEqual(poll);
                        });
            });

            it('should generate a async update poll action and fail', () => {
                const token = '123abc567lk';

                const postData = {};

                mock.onPatch(`http://localhost:5000/poll/${polls[0]._id}`).reply(400, {});

                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_FAIL,
                    loading: false,
                    error: {
                        isError: true,
                        value: 'Network Problem'
                    }
                }];

                return store
                        .dispatch(actions.updatePoll(postData, token, polls[0]._id))
                        .catch(() => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                        });
            });
        });

        describe("votePoll", () => {
            it('should generate a async vote poll action and success', () => {
                const userId = '50001';
                const response = polls[0];

                mock.onPatch(`http://localhost:5000/poll/${polls[0]._id}/vote`).reply(200, response);

                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_SUCCESS,
                    loading: false,
                    error: {
                        isError: false,
                        value: ''
                    }
                }];

                return store
                        .dispatch(actions.votePoll(polls[0]._id, polls[0].options[0]._id, userId))
                        .then((res) => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                            expect(res).toEqual(polls[0]);
                        });
            });

            it('should generate a async vote poll action and fail', () => {
                const userId = '50001';
                mock.onPatch(`http://localhost:5000/poll/${polls[0]._id}/vote`).reply(400, {});

                const expectedActions = [{
                    type: constants.POLL_LOADING,
                    loading: true
                }, {
                    type: constants.POLL_FAIL,
                    loading: false,
                    error: {
                        isError: true,
                        value: 'Network Problem'
                    }
                }];

                return store
                        .dispatch(actions.votePoll(polls[0]._id, polls[0].options[0]._id, userId))
                        .catch(() => {
                            const dispatchedActions = store.getActions();
                            expect(dispatchedActions[0]).toEqual(expectedActions[0]);
                            expect(dispatchedActions[1]).toEqual(expectedActions[1]);
                        });
            });
        });
    });
});