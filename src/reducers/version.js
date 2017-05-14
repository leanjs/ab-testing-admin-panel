import { VERSION_CREATED_SUCCESS, VERSION_RECEIVED_SUCCESS, VERSION_DELETED_SUCCESS, VERSION_UPDATED_SUCCESS } from '../actions'

const versionData = (state = [], action) => {
  switch (action.type) {

    case VERSION_CREATED_SUCCESS:
      return [...state, action.version]

    case VERSION_RECEIVED_SUCCESS:
      return [...action.versions]

    case VERSION_DELETED_SUCCESS:
      return [...state.filter( version => ( version.id !== action.version.id ))]

    case VERSION_UPDATED_SUCCESS:
      return state.map( version => {
        if ( version.id === action.version.id ) version = action.version
        return version
      })

    default:
      return state
  }
}

export default versionData