import React from 'react';

const PollStats = props => {
    return (
        <div>
            <ul>
                {
                    props.poll.options.map(option => <li key={option._id} >{option.value}:{option.votes}</li>)
                }
            </ul>
        </div>
    );
};

export default PollStats;