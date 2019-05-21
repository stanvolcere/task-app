import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, FETCH_TASKS } from './types';


export const signup = (formProps, callback) => async (dispatch) => {
    try {
        const res = await axios.post("http://localhost:5000/users/", formProps);
        dispatch({type: AUTH_USER, payload: res.data.token });

        // this allows us to persist our token received from the api
        localStorage.setItem("token", res.data.token);
        callback();
    } catch(e) {
        //console.log(e);
        dispatch({type: AUTH_ERROR, payload: "Email is in use"});
    }
}

export const signout = (callback) => async (dispatch) => {
    localStorage.removeItem("token");

    // reuse of the AUTH_USER type but this time we pass an empty string as the payload
    dispatch({type: AUTH_USER, payload: ""});
    callback();
};

export const signin = (formProps, callback) => async (dispatch) => {
    try {
        const res = await axios.post("http://localhost:5000/users/login", formProps);
        dispatch({type: AUTH_USER, payload: res.data.token });

        // this allows us to persist our token received from the api
        localStorage.setItem("token", res.data.token);
        callback();
    } catch(e) {
        //console.log(e);
        dispatch({type: AUTH_ERROR, payload: "Email or password was incorrect."});
    }
}

export const fetchTasks = (auth) => async (dispatch) => {
    const authToken = `Bearer ${auth}`;
    // sets the correct auth header
    const config = { headers: { 'Authorization': authToken } };

    const res = await axios.get("http://localhost:5000/tasks/", config);
    dispatch({type: FETCH_TASKS, payload: res.data });
    
    //console.log(res);

};