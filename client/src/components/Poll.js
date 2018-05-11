import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import * as pollActions from '../store/actions/poll';

export class Poll extends React.Component {
    async componentDidMount() {
        const id = this.props.match.params.id;
        await this.props.fetchPoll(id);
    }
    render() {
        let poll = <h2 style={{ textAlign: "center"}}>Loading...</h2>;
        let editButton;
        if (this.props.poll) {
            if (this.props.userId) {
                editButton = this.props.userId === this.props.poll.author ? (<button>Edit</button>) : null;
            }
            poll = (
                <div>
                    <h2>{this.props.poll.question}</h2>
                    <p>by {this.props.poll.author}</p>
                    <ul>
                    {
                        this.props.poll.options.map(option => <li key={option._id} >{option.value}:{option.votes}</li>)
                    }
                    </ul>
                    { editButton }
                </div>
            );
        }
        return poll;
    }
}

const mapStateToProps = state => {
    return {
        loading: state.poll.loading,
        poll: isEmpty(state.poll.poll) ? null : state.poll.poll,
        userId: state.auth.userId || null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPoll: (id) => dispatch(pollActions.fetchPoll(id))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Poll);