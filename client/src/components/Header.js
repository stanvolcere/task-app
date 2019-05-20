import React from 'react';
import { Link } from "react-router-dom";

// import { connect } from 'react-redux';
// import { fetchUser } from '../actions/index'

class Header extends React.Component {

    render() {
        return (
            <div>
                <div className="nav-wrapper">
                    <Link to="/">Home</Link>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/signin">Sign In</Link>
                    <Link to="/feature">Feature</Link>
                    <Link to="/signout">Sign Out</Link>
                </div>
            </div>
        ) 
    }
}

// es6 destructuring here because the incoming param is the state param
// const mapStateToProps = ({auth}) => {
//     return {auth};
// }

export default Header;




