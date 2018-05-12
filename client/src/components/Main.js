import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Polls from './Polls';
import Poll from './Poll';
import CreatePoll from './CreatePoll';
import EditPoll from './EditPoll';
import Login from './Login';
import SignUp from './SignUp';
import Logout from './Logout';
import ChangePassword from './ChangePassword';

const Main = (props) => {
    let switchRoutes = (
        <Switch>
            <Route path="/" exact component={Polls} />
            <Route path="/poll/:id" component={Poll} />            
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
        </Switch>
    );

    if (props.isAuth) {
        switchRoutes = (
            <Switch>
                <Route path="/" exact component={Polls} />
                <Route path="/poll/create" exact component={CreatePoll} />                                            
                <Route path="/poll/:id" exact component={Poll} />                            
                <Route path="/poll/:id/edit" exact component={EditPoll} />                            
                <Route path="/password/change" component={ChangePassword} />                
                <Route path="/logout" component={Logout} />
            </Switch>
        );
    }
    return (
        <main>
          {switchRoutes}
        </main>
    );
};

export default Main;