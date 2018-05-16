import React from 'react';
import { connect } from 'react-redux';

import * as pollActions from '../store/actions/poll';
// import "./PollForm.css";

export class CreatePoll extends React.Component {
    state = {
        question: "",
        options: [{
            value: ""
        }, {
            value: ""
        }]
    };

    questionChangeHandler = e => {
        this.setState({ question: e.target.value });
    };

    optionsChangeHandler = (e, index) => {
        const value = e.target.value;
        this.setState(prevState => {
            return {
                options: prevState.options.map((option, i) => {
                    if (index === i) {
                        return {
                            value
                        }
                    } else {
                        return option;
                    }
                })
            };
        });
    };

    addOptions = (e) => {
        e.preventDefault();
        this.setState(prevState => {
            return {
                options: [...prevState.options, { value: "" }]
            };
        });
    };

    submitHandler = async e => {
        e.preventDefault();


        if (this.validation()) return;

        const poll = {
            question: this.state.question,
            options: this.trimOption()
        };

        try {
            await this.props.createPoll(poll, this.props.token);
            this.props.history.push('/');
        } catch (e) {
        }        

    };

    trimOption = () => {
        const options = [...this.state.options];
        let trimOptions = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].value.trim().length > 0) {
                trimOptions.push(options[i]);
            }
        }

        return trimOptions;
    }

    validation = () => {
        let error = false;
        const options = [...this.state.options];

        if (this.state.question.trim().length < 1) {
            error = true;
        }

        for (let i = 0; i < 2; i++) {
            if (options[i].value.trim().length < 1) {
                error = true;
            }
        }

        return error;
    };

    render() {
        let createPoll = (
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <form onSubmit={this.submitHandler}>
                                <div className="field">
                                    <label className="label">Question</label>
                                    <div className="control">
                                        <input 
                                            className="input"
                                            type="text"
                                            placeholder="Question"
                                            value={this.state.question}
                                            onChange={this.questionChangeHandler}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Options</label>
                                        <div className="control">
                                        {
                                            this.state.options.map((option, index) => {
                                                return (
                                                    <input
                                                        key={index}
                                                        className="input"
                                                        type="text" 
                                                        placeholder={`Option ${index + 1}`}
                                                        value={option.value}
                                                        onChange={e => this.optionsChangeHandler(e, index)}
                                                    />
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                   <div className="level"> 
                                        <div className="level-item">
                                            <button className="button is-warning is-small addOption" onClick={this.addOptions}>Add Option</button>                                            
                                        </div>
                                    </div>
                                <div className="level">
                                    <div className="level-item">
                                        <input 
                                            className="button is-medium is-success"
                                            type="submit"
                                            value="Create Poll"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );

        if (this.props.loading) {
            createPoll = <h2 style={{ textAlign: "center"}}>Loading...</h2>;
        }
        return createPoll;
    }
}

const mapStateToProps = state => {
    return {
        loading: state.poll.loading,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createPoll: (poll, token) => dispatch(pollActions.createPoll(poll, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll);