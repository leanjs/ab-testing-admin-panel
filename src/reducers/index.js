import { combineReducers } from 'redux'
import login from './login'
import versionData from './version'
import siteData from './site'

const reducers = combineReducers({
  login,
  versionData,
  siteData
})

export default reducers
