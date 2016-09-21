import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { Provider, connect } from 'react-redux'
import axios from 'axios'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux';

const loggerMiddleware = createLogger()


// ----- Actions for fetching and receiving User data from github -----
// simple action to notify the store that we're starting to fetch user 
const REQUEST_USER = 'REQUEST_USER'
const requestUser = function (userId) {
    return { type: REQUEST_USER, userId }
}

// Creates an action with the json returned from fetching user
const RECEIVE_USER = 'RECEIVE_USER'
const receiveUser = function (json) {
    return { type: RECEIVE_USER, json }
}

// Action creater that returns a function(dispatch)
const fetchUser = function (userId) {
    return function (dispatch) {
        // We generate and dispatch the REQUEST_USER action
        dispatch(requestUser(userId))
        // Then we do the AJAX call...
        // ...and finally generate and dispatch the RECEIVE_USER action with json
        return axios.get('https://api.github.com/users/' + userId)
            .then(response => response.data)
            .then(json => 
                dispatch(receiveUser(json))
            )
    }
}


// ----- Reducers for handling actions above and updating store -----
const initialState = {isFetching: false,
    'name': undefined,
    'login': undefined}
function userApp(state = initialState, action) {
    switch (action.type) {
        case REQUEST_USER:
            // don't need any info from action - just set isFetching
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_USER:
            let json = action.json;
            return Object.assign({}, state, {
                isFetching: false,
                name: json.name,
                login: json.login
            })
        default:
            return state
    }
}


// ------ Redux Store itself ------
let store = createStore(
    userApp,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    )
)


// Top level component, loaded on '/' and always visible.
// props.children contains the rest of the App, as nested
// is child Route components below.
const App = React.createClass({
    render() {
        return (
            <div>
                <h1>React Router Tutorial</h1>
                <ul role="nav">
                    <li><Link to="/" onlyActiveOnIndex>Home</Link></li>
                    <li><Link to="/users/will-moore">Will</Link></li>
                    <li><Link to="/users/jburel">Jean Marie</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
})


// Placeholder, shown as child of App at '/'
const Home = () => (
    <div>Pick a user from links above to load data from github</div>
)


// Child of App, passed :userName in props.params
// from the url /users/:userName
const User = React.createClass({

    // We are the first child of ChannelListContainer which connect() to store
    // and defines a fetchImage() function as prop.
    // So we can call it from here when the page loads.
    // This will fetch data, populate the store and cause this Component to be re-rendered.
    componentWillMount() {
        this.props.fetchUser(this.props.userId);
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.userId !== this.props.userId) {
            this.props.fetchUser(nextProps.userId)
        }
    },

    render() {
        return (
            <div>
                <h2>{this.props.userId}</h2>
                <p>{this.props.name}</p>
            </div>
        )
    }
})


// -------- connect() store with component --------
// Define how state from store gets mapped to
// props of child component <User>
const mapStateToProps = (state, ownProps) => {
    return {
        userId: ownProps.params.userId,    // pass userId down from router
        name: state.name,
        login: state.login
    }
}
// Define functions that modify store and are
// passed as props of User component so that it
// can update store
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchUser: (userId) => {
            dispatch(fetchUser(userId))
        },
    }
}
// Create the UserContainer to wrap User component
// with the map functions above
const UserContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(User)


// The main render method where we set up Routes
// and load into #app element.
render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="/users/:userId" component={UserContainer} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'))
