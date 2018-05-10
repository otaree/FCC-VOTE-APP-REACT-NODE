import React from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import axios from 'axios';


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
            const response = await axios.post("http://localhost:5000/user", user);
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
            <section className="auth">
                {
                    this.props.authError.isError &&
                    <div className="auth-server-fail">{this.props.authError.value}</div>
                }
                <form className="form" onSubmit={this.submitHandler}>
                    <div className="form-control">
                        <input 
                            type="text"
                            placeholder="Username"
                            value={this.state.username.value}
                            onChange={this.nameChangeHandler}
                        />
                        {
                            this.state.username.error &&
                            <div className="auth-error">Please provide a username</div>
                        }
                    </div>
                    <div className="form-control">
                        <input 
                             type="email"
                             placeholder="Email"
                             value={this.state.email.value}
                             onChange={this.emailChangeHandler}
                         />
                         {
                             this.state.email.error &&
                             <div className="auth-error">Invalid email</div>
                         }
                   </div>
                   <div className="form-control">
                        <input 
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
                   <div className="form-control">
                        <input 
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
                   <div className="form-control">
                        <input 
                            className="btn"
                             type="submit"
                             value="Register"
                         />
                   </div>
                </form>
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