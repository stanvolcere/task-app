import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class SignUp extends React.Component {

    onSubmit = formProps => {
        this.props.signup(formProps, () => {
            this.props.history.push("/feature");
        });
    }

    render() {

        // this handleSub,it is given to us for free
        const { handleSubmit } = this.props;

        return (
            <div>
               <form onSubmit={handleSubmit(this.onSubmit)}>
               <fieldset>
                    <label>Name</label>
                    <Field
                        name="name"
                        type="text"
                        component="input"
                        autoComplete="none"
                    />
                </fieldset>
                <fieldset>
                    <label>Email</label>
                    <Field
                        name="email"
                        type="text"
                        component="input"
                        autoComplete="off"
                    />
                </fieldset>
                <fieldset>
                    <label>Password</label>
                    <Field
                        name="password"
                        type="password"
                        component="input"
                        autoComplete="none"
                    />
                </fieldset>

                <div>{this.props.errorMessage}</div>
                <button>Sign Up</button>
               </form>
            </div>
        ) 
    }
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage
    }
}


//allows us to apply as many higher order compnenets as we need
// all while keeping our code readable
export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signup' })
)(SignUp);
