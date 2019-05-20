import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import requireAuth from './requireAuth';

class Dashboard extends React.Component {

    componentDidMount() {
        this.props.fetchTasks(this.props.auth);
    }

    render() {
        return (
            <div>
                Welcome to Task App (this is where all the tasks will appear)
            </div>
        ) 
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.authenticated
    }
}

export default compose(
    connect(mapStateToProps, actions),
    requireAuth
)(Dashboard);
// the requireAuth will 
//export default requireAuth(Dashboard);