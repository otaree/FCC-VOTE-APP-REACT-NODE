import React from 'react';
import { Link } from 'react-router-dom';

import './PollsList.css';

const PollsList = props => {
    return (
            <ul className="polls_list">
                {
                    props.polls.map(poll => <li className="polls_list_item" key={poll._id}><Link to={`poll/${poll._id}`}>{poll.question}</Link></li>)
                }
            </ul>
    );
};

export default PollsList;