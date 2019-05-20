import React from 'react';
import { connect } from 'react-redux';
import { signout } from '../../actions';

class SignOut extends React.Component {

    componentDidMount() {
        this.props.signout();
    }

    render() {
        return (
            <div>
                Sorry to see you leave!
            </div>
        ) 
    }
}

export default connect(null, { signout })(SignOut);