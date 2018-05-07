import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li><NavLink to="/" activeClassName="active">Home</NavLink></li>
                    <li><NavLink to="/login" activeClassName="active">Login</NavLink></li>
                    <li><NavLink to="/signup" activeClassName="active">Sign up</NavLink></li>
                    <li><NavLink to="/logout" activeClassName="active">Logout</NavLink></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;