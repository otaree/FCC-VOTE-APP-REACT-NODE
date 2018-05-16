import React from 'react';

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
                    <div className="level"> 
                        <div className="control level-item">
                        {
                            this.props.poll.options.map(option => {
                                return (
                                        <label key={option._id} className="radio">
                                            <input 
                                                type="radio"
                                                name="vote"
                                                value={option._id}
                                                onChange={this.handleChange}
                                            />
                                             {option.value}
                                        </label>
                                );
                            })
                        }
                        </div>
                    </div>
                    <div className="level">
                        <div className="level-item">
                            <input 
                                className="button is-success"
                                type="submit"
                                value="Vote"
                            />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}