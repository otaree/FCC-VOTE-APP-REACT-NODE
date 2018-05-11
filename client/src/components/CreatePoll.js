import React from 'react';
import { connect } from 'react-redux';

import * as pollActions from '../store/actions/poll';

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

    render() {
        let createPoll = (
            <div>
                <form>
                    <div>
                        <input 
                            type="text"
                            placeholder="Question"
                            value={this.state.question}
                            onChange={this.questionChangeHandler}
                        />
                    </div>
                    <div>
                        {
                            this.state.options.map((option, index) => {
                                return (
                                    <input
                                        key={index}
                                        type="text" 
                                        placeholder={`Option ${index + 1}`}
                                        value={option.value}
                                        onChange={e => this.optionsChangeHandler(e, index)}
                                    />
                                )
                            })
                        }
                        <button>Add Option</button>
                    </div>
                    <div>
                        <button>Create Poll</button>
                    </div>
                </form>
            </div>
        );
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
        createPoll: (poll, token) => pollActions.createPoll(poll, token)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll);