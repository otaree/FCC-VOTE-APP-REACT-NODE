import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './Login';
import SignUp from './SignUp';
import Logout from './Logout';
import ChangePassword from './ChangePassword';

const Main = (props) => {
    let switchRoutes = (
        <Switch>
            <Route path="/" exact render={() => <div>Home</div>} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
        </Switch>
    );

    if (props.isAuth) {
        switchRoutes = (
            <Switch>
                <Route path="/" exact render={() => <div>Home</div>} />
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