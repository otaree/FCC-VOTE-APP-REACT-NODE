import React from 'react';
import { connect } from 'react-redux';

import * as pollActions from '../store/actions/poll';

export class EditPoll extends React.Component {
    state = {
        add: [],
        remove: [],
        poll: null
    };

    componentWillMount() {
        if (this.props.token === null) {
            this.props.history.push('/');
        }
    }

    async componentDidMount() {
        try {
            const id = this.props.match.params.id;
            await this.props.fetchPoll(id);
            this.setState({ poll: this.props.poll });
        } catch (e) {

        }
    }

    questionChangeHandler = e => {
        const value = e.target.value;
    
        this.setState(prevState => {
            return {
                poll: {
                    ...prevState.poll,
                    question: value
                }
            };
        });
    }

    optionsChangeHandler = (e, index) => {
        const value = e.target.value;

        this.setState(prevState => {
            return {
                poll: {
                    ...prevState.poll,
                    options: prevState.poll.options.map((option, i) => {
                        if (index === i) {
                            return {
                                ...option,
                                value
                            };
                        } else {
                            return option;
                        }
                    })
                }
            };
        });
    };

    addOptions = e => {
        e.preventDefault();

        this.setState(prevState => {
            return {
                poll: {
                    ...prevState.poll,
                    options: [...prevState.poll.options, { tag: "new", value: "" }]
                }
            };
        });
    };

    removeOptionsHandler = (e, index) => {
        e.preventDefault();
        this.setState(prevState => {
            return {
                remove: [...prevState.remove, prevState.poll.options.find((option, i) => i === index)],
                poll: {
                    ...prevState.poll,
                    options: prevState.poll.options.filter((option, i) => i !== index)
                }
            }
        });
    };

    deletePoll = async e => {
        e.preventDefault();

        try {
            const id = this.props.match.params.id;
            await this.props.deletePoll(this.props.token, id);
            this.props.history.push('/');
        } catch (e) {

        }
    };

    submitHandler = async e => {
        e.preventDefault();
        
        if (this.validation()) return;

        const newOptions = this.extractNewOptions();
        const add = newOptions.length < 1 ? null : newOptions.map(option => {
            return {
                value: option.value
            };
        });
        const filteredRemove = this.state.remove.filter(option => option.tag !== "new"); 
        const remove = filteredRemove.length < 1 ? null : filteredRemove;
        const poll = { add, remove };
        const id = this.props.match.params.id;

        
        try {
            await this.props.updatePoll(poll, this.props.token, id);
            this.props.history.push('/');
        } catch (e) {

        }
    };

    validation = () => {
        let error = false;
        const poll = {...this.state.poll};

        if (poll.question.trim().length < 1) {
            error = true;
        }

        for (let i = 0; i < poll.options.length; i++) {
            if (poll.options[i].value.trim().length < 1) {
                error = true;
            }
        }

        return error;
    };

    extractNewOptions = () => {
        const options = [...this.state.poll.options];
        return options.filter(option => {
            return option.tag === "new" && option.value.trim().length > 0;
        });
    }

    render() {
        let updatePoll = <h2 style={{ textAlign: "center" }}>Loading...</h2>;
        if (this.state.poll && !this.props.loading) {
            updatePoll = (
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
                                                value={this.state.poll.question}
                                                onChange={this.questionChangeHandler}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Options</label>
                                            {
                                                this.state.poll.options.map((option, index) => {
                                                    return (
                                                        <div key={index} className="field has-addons">
                                                            <div className="control has-icons-right is-expanded">
                                                                <input
                                                                    className="input"
                                                                    type="text" 
                                                                    placeholder={`Option ${index + 1}`}
                                                                    value={option.value}
                                                                    onChange={e => this.optionsChangeHandler(e, index)}
                                                                />
                                                            </div>
                                                            <div className="control">
                                                                <button className="delete removeOption" onClick={e => this.removeOptionsHandler(e, index)}></button>                                                                
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                    <div className="level"> 
                                        <div className="level-item">
                                            <button className="button is-warning is-small addOption" onClick={this.addOptions}>Add Option</button>                                            
                                        </div>
                                    </div>
                                    </div>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <input 
                                                className="button is-success"
                                                type="submit"
                                                value="Update Poll"
                                            />
                                        </div>

                                        <div className="control">
                                            <button className="button is-danger" onClick={this.deletePoll}>Delete Poll</button>                                            
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>);
        }
        return updatePoll;
    }
}

const mapStateToProps = state => {
    return {
        loading: state.poll.loading,
        poll: state.poll.poll,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPoll: (id) => dispatch(pollActions.fetchPoll(id)),
        updatePoll: (poll, token, id) => dispatch(pollActions.updatePoll(poll, token, id)),
        deletePoll: (token, id) => dispatch(pollActions.deletePoll(token, id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPoll);