import React from 'react';
import { NavLink } from 'react-router-dom';

// import './Header.css';

const Header = (props) => {
    let navlinks = (
        <div className="navbar-end">
            <NavLink className="navbar-item" to="/" exact activeClassName="active">Home</NavLink>
            <NavLink className="navbar-item" to="/login" activeClassName="active">Login</NavLink>
            <NavLink className="navbar-item" to="/signup" activeClassName="active">Sign up</NavLink>
        </div>
    );

    if (props.isAuth) {
        navlinks = (
            <div className="navbar-end">
                <NavLink className="navbar-item" to="/" exact activeClassName="active">Home</NavLink>
                <NavLink className="navbar-item" to="/poll/create" exact activeClassName="active">Create Poll</NavLink>
                <NavLink className="navbar-item" to="/password/change" activeClassName="active">Change Password</NavLink>                
                <NavLink className="navbar-item" to="/logout" activeClassName="active">Logout</NavLink>
            </div>
        );
    }

    return (
        <header>
            <nav className="navbar is-info">
                <div className="navbar-brand">
                    <a className="navbar-item">
                        <h2 className="is-size-3">POLL</h2>
                    </a>
                </div>
                <div className="navbar-menu is-active">                    
                    {navlinks}
                </div>
            </nav>
        </header>
    );
};

export default Header;