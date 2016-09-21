import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'


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
  render() {
    return (
      <div>
        <h2>{this.props.params.userName}</h2>
      </div>
    )
  }
})


// The main render method where we set up Routes
// and load into #app element.
render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/users/:userName" component={User} />
    </Route>
  </Router>
), document.getElementById('app'))
