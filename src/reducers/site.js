import { SITE_CREATED_SUCCESS, SITE_RECEIVED_SUCCESS, SITE_DELETED_SUCCESS, SITE_UPDATED_SUCCESS } from '../actions'

const siteData = (state = [], action) => {
  switch (action.type) {

    case SITE_CREATED_SUCCESS:
      return [...state, action.site]

    case SITE_RECEIVED_SUCCESS:
      return [...action.sites]

    case SITE_DELETED_SUCCESS:
      return [...state.filter( site => ( site.id !== action.site.id ))]

    case SITE_UPDATED_SUCCESS:
      return state.map( site => {
        if ( site.id === action.site.id ) site = action.site
        return site
      })

    default:
      return state
  }
}

export default siteData