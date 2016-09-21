import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
// import App from './modules/App'
// import About from './modules/About'
// import Repos from './modules/Repos'
// import Repo from './modules/Repo'
// import Home from './modules/Home'


const Home = () => (
	<div>Pick a user from links above to load data from github</div>
)

const NavLink = React.createClass({
  render() {
    return <Link {...this.props} activeClassName="active"/>
  }
})

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>React Router Tutorial</h1>
        <ul role="nav">
          <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
          <li><NavLink to="/users/will-moore">Will</NavLink></li>
          <li><NavLink to="/users/bob">Bob</NavLink></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

const User = React.createClass({
  render() {
    return (
      <div>
        <h2>{this.props.params.userName}</h2>
      </div>
    )
  }
})


render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/users/:userName" component={User} />
    </Route>
  </Router>
), document.getElementById('app'))
