import React from 'react';
import { Link } from 'react-router-dom';


const PollsList = props => {
    return (
        <div className="columns is-mobile">
             <div  className="column is-three-fifths is-offset-one-fifth">
                {
                    props.polls.map(poll => {
                        return (
                            <div key={poll._id} className="block">
                                <Link to={`poll/${poll._id}`}>
                                    <p className="title">{poll.question}</p>
                                    <p className="subtitle is-right">{poll.author.name}</p>
                                </Link>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default PollsList;