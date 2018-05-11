import React from 'react';
import { Link } from 'react-router-dom';

import './PollsList.css';

const PollsList = props => {
    return (
            <ul>
                {
                    props.polls.map(poll => <li key={poll._id}><Link to={`poll/${poll._id}`}>{poll.question}</Link></li>)
                }
            </ul>
    );
};

export default PollsList;