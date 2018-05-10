import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import App from './components/App';
import authReducer from './store/reducers/auth';
import pollReducer from './store/reducers/poll';
import './index.css';

const rootReducer = combineReducers({
    auth: authReducer,
    poll: pollReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const jsx = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(jsx, document.getElementById('root'));