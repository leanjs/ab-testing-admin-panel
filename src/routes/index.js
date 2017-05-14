import React from 'react'
import { Route, IndexRoute } from 'react-router'
import LoginPage from '../components/Login'
import VersionPage from '../components/Version'
import SitePage from '../components/Site'
import App from '../components/App'
import auth from '../auth'

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const routes = (
  <Route>
    <IndexRoute component={LoginPage}/>
    <Route path="/" component={App} onEnter={requireAuth}>
      <Route path="/versions" component={VersionPage} onEnter={requireAuth} />
      <Route path="/sites" component={SitePage} onEnter={requireAuth} />
    </Route>
    <Route path="/login" component={LoginPage} />
  </Route>
)

export default routes
