import React from 'react';
import { NavLink } from 'react-router-dom';

// import './Header.css';

class Header extends React.Component {
    state = {
        open: false
    };

    clickHandler = () => {
        this.setState(prevState => {
            return {
                open: !prevState.open
            };
        });
    };

    render() {
        let navlinks = (
            <div className="navbar-end">
                <NavLink className="navbar-item" to="/" exact activeClassName="is-active">Home</NavLink>
                <NavLink className="navbar-item" to="/login" activeClassName="is-active">Login</NavLink>
                <NavLink className="navbar-item" to="/signup" activeClassName="is-active">Sign up</NavLink>
            </div>
        );
    
        if (this.props.isAuth) {
            navlinks = (
                <div className="navbar-end">
                    <NavLink className="navbar-item" to="/" exact activeClassName="is-active">Home</NavLink>
                    <NavLink className="navbar-item" to="/poll/create" exact activeClassName="is-active">Create Poll</NavLink>
                    <NavLink className="navbar-item" to="/password/change" activeClassName="is-active">Change Password</NavLink>                
                    <NavLink className="navbar-item" to="/logout" activeClassName="is-active">Logout</NavLink>
                </div>
            );
        }
    
        return (
            <header>
                <nav className="navbar is-info">
                    <div className="container">
                        <div className="navbar-brand">
                            <a className="navbar-item">
                                <h2 className="is-size-3">POLL</h2>
                            </a>
            
                            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" onClick={this.clickHandler}>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                            </a>
            
                        </div>
                        <div className={`navbar-menu ${this.state.open && 'is-active'}`}>                    
                            {navlinks}
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;