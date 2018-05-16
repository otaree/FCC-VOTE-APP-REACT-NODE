import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import * as authActions from '../store/actions/auth';


export class ChangePassword extends React.Component {
    state = {
        password: {
            value: "",
            error: false
        },
        password2: {
            value: "",
            error: false
        }
    };

    passwordChangeHandler = e => {
        this.setState({ password: {
            value: e.target.value,
            error: false
        }});
    };

    password2ChangeHandler = e => {
        this.setState({ password2: {
            value: e.target.value,
            error: false
        }});
    };

    submitHandler = async e => {
        e.preventDefault();

        if (this.validation()) return;

        try {
            await axios({ method: "patch", url: "http://localhost:5000/user/password/change", data: { password: this.state.password.value }, headers: { 'x-auth': this.props.token } });
            this.props.history.push('/');
        } catch (e) {
            this.props.changeFail();
        }
    };

    validation = () => {
        let error = false;

        if (this.state.password.value.length < 6) {
            error = true;
            this.setState(prevState => {
                return {
                    password: {
                        value: prevState.password.value,
                        error: true
                    }
                };
            });
        }

        if (this.state.password.value !== this.state.password2.value) {
            error = true;
            this.setState(prevState => {
                return {
                    password2: {
                        value: prevState.password2.value,
                        error: true
                    }
                };
            });
        }

        return error;
    };

    render() {
        return (
            <section className="section">
                    <div className="container">
                    {
                        this.props.authError.isError &&
                        <div className="notification is-danger auth-error">
                            <button className="delete"></button>
                            {this.props.authError.value}
                        </div>
                    }
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <form onSubmit={this.submitHandler}>
                                <div className="field">
                                    <label className="label">New Password</label>
                                    <div className="control">
                                        <input 
                                            className="input"
                                            type="password"
                                            placeholder="New Password"
                                            value={this.state.password.value} 
                                            onChange={this.passwordChangeHandler}
                                        />
                                        {
                                             this.state.password.error &&
                                             <div className="auth-error">Invalid password</div>
                                         }
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Confirm Password</label>
                                    <div className="control">
                                        <input 
                                            className="input"
                                            type="password"
                                            placeholder="Confirm Password"   
                                            value={this.state.password2.value} 
                                            onChange={this.password2ChangeHandler}
                                        />
                                        {
                                             this.state.password2.error &&
                                             <div className="auth-error">Passwords dose not match</div>
                                         }
                                    </div>
                                </div>
                                <div className="control">
                                    <input 
                                        className="button is-success"
                                        type="submit"
                                        value="Change Password"    
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        authError: state.auth.error,
        loading: state.auth.loading,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeFail: () => dispatch(authActions.fail("Network Problem"))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);