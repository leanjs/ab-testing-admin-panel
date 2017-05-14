import {hashHistory} from 'react-router'
import { LOGIN_SUCCESS, LOGOUT } from '../actions'

const authLogin = (state = { token: !!sessionStorage.jwt }, action) => {
  switch (action.type) {

    case LOGIN_SUCCESS:
      hashHistory.push('/versions')
      return { ...state, token: !!sessionStorage.jwt }

    case LOGOUT:
      hashHistory.push('/login')
      return !!sessionStorage.jwt

    default:
      return state
  }
}

export default authLogin
