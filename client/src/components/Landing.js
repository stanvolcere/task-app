import React from 'react';
import { connect } from 'react-redux';
import { login } from "../actions/index"

class Landing extends React.Component {

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <div className="container" >
                    <div className="row">
                        <div className="col s6">
                            <form action="/users/login">
                                <input type="text" name="email" value="Mickey"></input>
                                <input type="text" name="password" value="Mickey"></input>
                                <input type="submit" value="Submit" onSubmit={this.props.login()}></input>
                            </form> 
                        </div>
                    </div>
                </div>
            </div>  
        ) 
    }
}

export default connect(null, { login })(Landing);