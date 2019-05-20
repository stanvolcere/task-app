import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import App from './components/App';
import Dashboard from "./components/Dashboard";
import SignUp from "./components/Auth/SignUp";
import SignOut from "./components/Auth/SignOut";
import SignIn from "./components/Auth/SignIn";

import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// rememebr redux thunk allows us to perform async action creators
const store = createStore(reducers, {auth: {authenticated: localStorage.getItem("token")}}, composeEnhancers(applyMiddleware(reduxThunk)));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App>
                <Route path="/feature" exact component={Dashboard}></Route>
                <Route path="/signup" exact component={SignUp}></Route>
                <Route path="/signout" exact component={SignOut}></Route>
                <Route path="/signin" exact component={SignIn}></Route>
            </App>
        </BrowserRouter>
    </Provider>
   , 
    document.querySelector('#root')
    );