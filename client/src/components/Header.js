import React from 'react';
import { NavLink } from 'react-router-dom';

import './Header.css';

const Header = (props) => {
    let navlinks = (
        <ul>
            <li><NavLink to="/" exact activeClassName="active">Home</NavLink></li>
            <li><NavLink to="/login" activeClassName="active">Login</NavLink></li>
            <li><NavLink to="/signup" activeClassName="active">Sign up</NavLink></li>
        </ul>
    );

    if (props.isAuth) {
        navlinks = (
            <ul>
                <li><NavLink to="/" exact activeClassName="active">Home</NavLink></li>
                <li><NavLink to="/password/change" activeClassName="active">Change Password</NavLink></li>                
                <li><NavLink to="/logout" activeClassName="active">Logout</NavLink></li>
            </ul>
        );
    }

    return (
        <header>
            <nav>
                {navlinks}
            </nav>
        </header>
    );
};

export default Header;