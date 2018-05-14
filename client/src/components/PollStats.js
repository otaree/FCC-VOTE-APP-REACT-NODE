import React from 'react';

const PollStats = props => {
    return (
        <div>
            <h2>{props.poll.question}</h2>
            <p>by {props.poll.author}</p>
            <ul>
                {
                    props.poll.options.map(option => <li key={option._id} >{option.value}:{option.votes}</li>)
                }
            </ul>
            {props.children}
        </div>
    );
};

export default PollStats;