import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';

import Chart from './Chart';
import VotePoll from './VotePoll';
import * as pollActions from '../store/actions/poll';

export class Poll extends React.Component {
    async componentDidMount() {
        const id = this.props.match.params.id;
        await this.props.fetchPoll(id);
    }

    componentWillUnmount() {
        this.props.unsetPoll();
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
                editButton = this.props.userId === this.props.poll.author._id ? (
                    <div className="level-item ">
                        <Link className="button is-info" to={`/poll/${this.props.poll._id}/edit`}>Edit</Link>
                    </div>
                        ) : null;
            }
            poll = (
                <section className="section">
                    <div className="container">
                        <div className="box">
                            <div className="level">
                                <div className="level-item">
                                    <h2 className="title">{this.props.poll.question}</h2>                                        
                                </div>
                            </div>
                                <div className="level">
                                    <div className="level-item">
                                        <p className="subtitle">by {this.props.poll.author.name}</p>                                            
                                    </div>
                                </div>
                            <div className="level">
                                <div className="level-item">
                                    {editButton}                                        
                                </div>
                            </div>
                            {
                                this.props.poll.voters.indexOf(this.props.uid) === -1 ? (
                                    <VotePoll poll={this.props.poll} onVote={this.voteHandler}/>
                                ): (
                                    <Chart poll={this.props.poll} />
                                )
                            }
                        </div>
                    </div>
                </section>
            );
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
        setPoll: (poll) => dispatch(pollActions.setPoll(poll)),
        unsetPoll: () => dispatch(pollActions.unsetPoll())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Poll);