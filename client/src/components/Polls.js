import React from 'react';
import { connect } from 'react-redux';

import PollsList from './PollsList';
import * as pollActions from '../store/actions/poll';

export class Polls extends React.Component {
    async componentDidMount() {
        await this.props.fetchPolls();
    }
    render() {
        let polls = (
            <div className="section">
                <div className="container">
                    <div className="level">
                        <div className="level-item">
                            <div className="title has-text-info">Polls</div>
                        </div>
                    </div>
                    {
                        this.props.polls.length > 0 ? 
                        (<PollsList polls={this.props.polls} />) :
                        (<div style={{ textAlign: "center" }}>No Polls</div>)
                    }
                </div>
            </div>
        );
        if (this.props.loading) {
            polls = <h2 style={{ textAlign: "center" }}>Loading...</h2>  
        }

        return polls;
    }
}

const mapStateToProps = state => {
    return {
        polls: state.poll.polls,
        loading: state.poll.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPolls: () => dispatch(pollActions.fetchPolls())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Polls);

