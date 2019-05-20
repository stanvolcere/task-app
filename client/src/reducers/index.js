import {combineReducers} from "redux";
import authReducer from './authReducer';
import tasksReducer from './tasksReducer';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
    auth: authReducer,
    // setup for redux form
    form: formReducer,
    tasks: tasksReducer
})