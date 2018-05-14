import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import App from './components/App';
import * as authActions from './store/actions/auth';
import authReducer from './store/reducers/auth';
import pollReducer from './store/reducers/poll';
import './index.css';

const rootReducer = combineReducers({
    auth: authReducer,
    poll: pollReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; 

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const jsx = (
    <Provider store={store}>
        <App />
    </Provider>
);

let hasRender = false;

const renderApp = () => {
    if (!hasRender) {
        ReactDOM.render(jsx, document.getElementById('root'));
        hasRender = true;
    }
};

ReactDOM.render(<h2 style={{ textAlign: "center"}}>Loading...</h2>, document.getElementById('root'));

store.dispatch(authActions.getUid());
renderApp();