import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';

import PollStats from './PollStats';
import VotePoll from './VotePoll';
import * as pollActions from '../store/actions/poll';
import "./Poll.css";

export class Poll extends React.Component {
    async componentDidMount() {
        const id = this.props.match.params.id;
        await this.props.fetchPoll(id);
    }

    voteHandler = async (optionsId) => {
        try {
            const id = this.props.match.params.id;
            const poll = await this.props.vote(id, optionsId, this.props.uid);
            this.props.setPoll(poll);
        } catch (e) {

        }
    };

    render() {
        let poll = <h2 style={{ textAlign: "center"}}>Loading...</h2>;
        let editButton;
        if (this.props.poll) {
            if (this.props.userId) {
                editButton = this.props.userId === this.props.poll.author._id ? (<Link to={`/poll/${this.props.poll._id}/edit`}>Edit</Link>) : null;
            }
            if (this.props.poll.voters.indexOf(this.props.uid) === -1) {
                poll = (
                    <div className="Poll_body">
                        <div className="Poll_header">
                            <h2>{this.props.poll.question}</h2>
                            <p>by {this.props.poll.author.name}</p>
                            <div className="Poll_control">
                                { editButton }
                            </div>
                        </div>
                        <VotePoll poll={this.props.poll} onVote={this.voteHandler} />
                    </div>
                );                
            } else {
                poll = (
                    <div className="Poll_body">
                        <div className="Poll_header">
                            <h2>{this.props.poll.question}</h2>
                            <p>by {this.props.poll.author.name}</p>
                            <div className="Poll_control">
                                { editButton }
                            </div>
                        </div>
                        <PollStats poll={this.props.poll} />
                    </div>
                );
            }
        }
        return poll;
    }
}

const mapStateToProps = state => {
    return {
        loading: state.poll.loading,
        poll: isEmpty(state.poll.poll) ? null : state.poll.poll,
        uid: state.auth.uid,
        userId: state.auth.userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPoll: (id) => dispatch(pollActions.fetchPoll(id)),
        vote: (id, optionId, uid) => dispatch(pollActions.votePoll(id, optionId, uid)),
        setPoll: (poll) => dispatch(pollActions.setPoll(poll))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Poll);