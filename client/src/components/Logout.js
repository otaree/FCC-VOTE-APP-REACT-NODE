import React from 'react';
import { connect } from 'react-redux';
import axios from '../axios-poll';

import * as authActions from '../store/actions/auth';

export class Logout extends React.Component {
   async componentDidMount () {
        try {
            await axios({ url: "/user/logout", method: 'delete', headers: { 'x-auth': this.props.token } });
            this.props.logout();
            this.props.history.push("/");
        } catch (e) {
            this.props.logoutFail();
        }
    }
    render() {
        return (
            <div>
                {
                    this.props.authError.isError ?
                    <div>{this.props.authError.value}</div> :
                    <div>Loading...</div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authError: state.auth.error,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(authActions.logout()),
        logoutFail: () => dispatch(authActions.fail("Unable to logout."))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);

