import React from 'react';
import { connect } from 'react-redux';

import * as pollActions from '../store/actions/poll';
import "./PollForm.css";

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
            <div className="Poll_form_container">
                <form className="Poll__form" onSubmit={this.submitHandler}>
                    <div className="Poll__form__control">
                        <input 
                            className="Poll__form_question"
                            type="text"
                            placeholder="Question"
                            value={this.state.question}
                            onChange={this.questionChangeHandler}
                        />
                    </div>
                    <div className="Poll__form__control">
                        {
                            this.state.options.map((option, index) => {
                                return (
                                    <input
                                        key={index}
                                        className="Poll__form_option"
                                        type="text" 
                                        placeholder={`Option ${index + 1}`}
                                        value={option.value}
                                        onChange={e => this.optionsChangeHandler(e, index)}
                                    />
                                )
                            })
                        }
                       <div className="add__container"> 
                           <button className="addOption__btn" onClick={this.addOptions}>Add Option</button>
                        </div>
                    </div>
                    <div className="Poll_submit_container">
                        <input 
                            className="submit__btn"
                            type="submit"
                            value="Create Poll"
                        />
                    </div>
                </form>
            </div>
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