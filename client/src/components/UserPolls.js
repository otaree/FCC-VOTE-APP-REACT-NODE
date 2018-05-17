import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../axios-poll';

export class UserPolls extends React.Component {
    state = {
        polls: [],
        error: false,
        loading: true
    };

    componentDidMount() {
        this.fetchPolls();
    }

    fetchPolls = async () => {
        try {
            this.setState({ loading: true });
            const response = await axios({ url: "/polls/user", method: "get", headers: { "x-auth": this.props.token } });
            this.setState({
                polls: response.data,
                error: false,
                loading: false
            });
        } catch (e) {
            this.setState({
                polls: [],
                error: false,
                loading: false
            });
        }
    };

    render() {
        let userPolls = <h2 className="is-2">Loading...</h2>;
        if (!this.state.loading) {
            if (this.state.error) {
                userPolls = (
                    <section className="section">
                        <div className="container">
                            <div className="notification is-danger auth-error">
                                <button className="delete"></button>
                                Network Failure
                            </div>
                        </div>
                    </section>
                );
            } else {
                userPolls = (
                    <section className="section">
                        <div className="container">
                           {
                               this.state.polls.length > 0 ? (
                                   this.state.polls.map(poll => {
                                       return (
                                           <div key={poll._id} className="block">                                                
                                                <Link to={`/poll/${poll._id}`}>
                                                    <p className="title">
                                                        {poll.question}
                                                    </p>
                                                </Link>
                                           </div>
                                       );
                                   })
                               ) : (
                                   <div className="level">
                                        <div className="level-item">
                                            <p className="title">
                                                No Polls
                                            </p>
                                        </div>
                                   </div>
                               )
                           }
                        </div>
                    </section>
                );
            }
        }
        return userPolls;
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username,
    };
};

export default connect(mapStateToProps)(UserPolls);