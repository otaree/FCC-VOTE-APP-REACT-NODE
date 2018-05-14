import React from 'react';

import './VotePoll.css';

export default class VotePoll extends React.Component {
    state = {
        selected: null
    };
    handleChange = e => {
        this.setState({ selected: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        if (!this.state.selected) return;

        this.props.onVote(this.state.selected);
    };
    render() {
        return (
            <div className="VotePoll">
                <form onSubmit={this.handleSubmit}>
                    {
                        this.props.poll.options.map(option => {
                            return (
                                <div key={option._id}>
                                    <input 
                                        type="radio"
                                        name="vote"
                                        value={option._id}
                                        onChange={this.handleChange}
                                    />
                                    {option.value}
                                    <br />
                                </div>
                            );
                        })
                    }
                    <div className="vote_Button">
                        <input 
                            className="vote__btn"
                            type="submit"
                            value="Vote"
                        />
                    </div>
                </form>
            </div>
        );
    }
}