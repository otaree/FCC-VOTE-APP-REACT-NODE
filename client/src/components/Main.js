import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './Login';
import SignUp from './SignUp';
import Logout from './Logout';

const Main = () => {
    return (
        <main>
           <Switch>
               <Route path="/" exact render={() => <div>Home</div>} />
               <Route path="/login" component={Login} />
               <Route path="/signup" component={SignUp} />
               <Route path="/logout" component={Logout} />
           </Switch>
        </main>
    );
};

export default Main;