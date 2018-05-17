import React from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import axios from '../axios-poll';
import FaUser from 'react-icons/lib/fa/user';
import FaEnvelope from 'react-icons/lib/fa/envelope';

import * as authActions from '../store/actions/auth';

export class SignUp extends React.Component {
    state = {
        username: {
            value: "",
            error: false
        },
        email: {
            value: "",
            error: false
        },
        password: {
            value: "",
            error: false
        },
        password2: {
            value: "",
            error: false
        }
    };

    nameChangeHandler = e => {
        this.updateFieldValue("username", e.target.value);
    };

    emailChangeHandler = e => {
        this.updateFieldValue("email", e.target.value);
    };

    passwordChangeHandler = e => {
        this.updateFieldValue("password", e.target.value);
    };

    password2ChangeHandler = e => {
        this.updateFieldValue("password2", e.target.value);
    };

    submitHandler = async e => {
        e.preventDefault();

        if (this.validator()) return;

        const user = { 
            name: this.state.username.value, 
            email: this.state.email.value, 
            password: this.state.password.value  
        };

        try {
            const response = await axios.post("/user", user);
            this.props.signUp({ ...response.data, token: response.headers['x-auth'] });
            this.props.history.push('/');
        } catch (e) {
            this.props.signUpFail();
        }

    }

    validator = () => {
        let error = false;

        if (this.state.username.value < 1) {
            error = true;

            this.setState(prevState => {
                return {
                    username: {
                        value: prevState.username.value,
                        error: true
                    }
                };
            });
        }

        if (!isEmail(this.state.email.value)) {
            error = true;
            
            this.setState(prevState => {
                return {
                    email: {
                        value: prevState.email.value,
                        error: true
                    }
                };
            });
        }

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

    updateFieldValue = (field, value) => {
        this.setState(prevState => {
            return {
                [field]: {
                    value,
                    error: false
                }
            };
        });
    };

    render() {
        return (
            <section className="section">
                {
                    this.props.authError.isError &&
                    <div className="notification is-danger auth-error">
                        <button className="delete"></button>
                        {this.props.authError.value}
                    </div>
                }
                <div className="level">
                        <div className="level-item">
                            <div className="title">SignUp</div>
                        </div>
                </div>
                <div className="columns is-mobile">
                    <div className="column is-half is-offset-one-quarter">
                        <form  onSubmit={this.submitHandler}>
                            <div className="field">
                                <label className="label">Username</label>
                                <div className="control has-icons-left">
                                    <input 
                                        className="input"
                                        type="text"
                                        placeholder="Username"
                                        value={this.state.username.value}
                                        onChange={this.nameChangeHandler}
                                    />
                                    <span className="icon is-small is-left">
                                         <FaUser />
                                     </span>
                                    {
                                        this.state.username.error &&
                                        <div className="auth-error">Please provide a username</div>
                                    }
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Email</label>
                                <div className="control has-icons-left">
                                    <input 
                                        className="input"
                                         type="email"
                                         placeholder="Email"
                                         value={this.state.email.value}
                                         onChange={this.emailChangeHandler}
                                     />
                                     <span className="icon is-small is-left">
                                         <FaEnvelope />
                                     </span>
                                     {
                                         this.state.email.error &&
                                         <div className="auth-error">Invalid email</div>
                                     }
                                </div>
                            </div>
                                 
                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control">
                                     <input 
                                         className="input"
                                          type="password"
                                          placeholder="Password"
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
                                  
                            <div className="field">
                                <div className="control">
                                     <input 
                                         className="button is-primary"
                                          type="submit"
                                          value="Register"
                                      />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        authError: state.auth.error,
        loading: state.auth.loading
    };
};

const mapDispatchProps = dispatch => {
    return {
        signUp: (user) => dispatch(authActions.login(user)),
        signUpFail: () => dispatch(authActions.fail("Auth Error"))
    };
};

export default connect(mapStateToProps, mapDispatchProps)(SignUp);