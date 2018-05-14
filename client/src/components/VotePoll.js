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
            <div>
                <h2>{this.props.poll.question}</h2>
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
                    <div>
                        <input 
                            type="submit"
                            value="Vote"
                        />
                    </div>
                </form>
                {this.props.children}
            </div>
        );
    }
}