import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './Header';
import Main from './Main';

export class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Header />
                <Main />
            </BrowserRouter>
        );
    }
}