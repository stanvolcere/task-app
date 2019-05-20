import { AUTH_USER, AUTH_ERROR } from '../actions/types';

// hold the inital state for the auth
const INITIALSTATE = {
    authenticated: "",
    errorMessage: ""
};

export default (state = INITIALSTATE, action) => {

    switch(action.type) {
        case AUTH_USER:
            return {...state, authenticated: action.payload, errorMessage: ""};
        case AUTH_ERROR:
            return {...state, errorMessage: action.payload}
        default:
            return state;
    }
        
}