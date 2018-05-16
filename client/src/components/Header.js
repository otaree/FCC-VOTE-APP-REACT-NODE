import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import FaUser from 'react-icons/lib/fa/user';
import MdSettings from 'react-icons/lib/md/settings-applications';
import MdPoll from 'react-icons/lib/md/poll';

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
                    <div className="navbar-item has-dropdown is-hoverable">
                        <NavLink className="navbar-link" to="/polls/user" exact activeClassName="is-active"> <FaUser style={{ marginRight: "3px"}} /> {this.props.username}</NavLink>
                        <div className="navbar-dropdown is-boxed">
                            <NavLink className="navbar-item" to="/poll/create" exact activeClassName="is-active">Create Poll</NavLink>
                            <NavLink className="navbar-item" to="/password/change" activeClassName="is-active"><MdSettings size={20} /></NavLink>                
                            <NavLink className="navbar-item" to="/logout" activeClassName="is-active">Logout</NavLink>
                        </div>
                    </div>
                </div>
            );
        }
    
        return (
            <header>
                <nav className="navbar is-info">
                    <div className="container">
                        <div className="navbar-brand">
                            <Link className="navbar-item" to="/">
                                <MdPoll 
                                    size={50}
                                />
                            </Link>
            
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