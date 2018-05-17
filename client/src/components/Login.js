import React from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import axios from '../axios-poll';
import FaEnvelope from 'react-icons/lib/fa/envelope';

import * as authActions from '../store/actions/auth';
import "./auth.css";

export class Login extends React.Component {
    state = {
        email: {
            value: "",
            error: false
        },
        password: {
            value: "",
            error: false
        }
    };

    emailChangeHandler = e => {
        this.updateFieldValue("email", e.target.value);
    };

    passwordChangeHandler = e => {
        this.updateFieldValue("password", e.target.value);
    };

    submitHandler = async e => {
        e.preventDefault();

        if (this.validator()) return;

        const user = { 
            email: this.state.email.value, 
            password: this.state.password.value  
        };

        try {
            const response = await axios.post("/user/login", user);
            this.props.login({ ...response.data, token: response.headers['x-auth'] });
            this.props.history.push('/');
        } catch (e) {
            this.props.loginFail();
        }

    }

    validator = () => {
        let error = false;

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
                            <div className="title">Login</div>
                        </div>
                </div>
                <div className="columns is-mobile">
                    <div className="column is-half is-offset-one-quarter">
                        <form onSubmit={this.submitHandler}>
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
                                <div className="control">
                                     <input 
                                         className="button is-primary"
                                          type="submit"
                                          value="Login"
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
        login: (user) => dispatch(authActions.login(user)),
        loginFail: () => dispatch(authActions.fail("Invalid email/password"))
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Login);