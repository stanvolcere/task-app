import _ from 'lodash';
import { FETCH_TASKS } from '../actions/types';

// hold the inital state for the auth
export default (state = {}, action) => {
    switch(action.type) {
        case FETCH_TASKS:
            //return { ...state, tasks: action.payload};
            return {..._.mapKeys(action.payload, '_id')};
        default:
            return state;
    }
        
}