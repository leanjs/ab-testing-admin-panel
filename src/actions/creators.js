import * as actions from './index'
import * as api from '../api'
import auth from '../auth'

export const loginSuccess = (token) => ({
  type: actions.LOGIN_SUCCESS,
  token
})

/*
    VERSIONS
 */

export const versionCreatedSuccess = (newVersion) => ({
  type: actions.VERSION_CREATED_SUCCESS,
  version: newVersion
})

export const versionReceivedSuccess = (versions) => ({
  type: actions.VERSION_RECEIVED_SUCCESS,
  versions
})

export const versionDeletedSuccess = (version) => ({
  type: actions.VERSION_DELETED_SUCCESS,
  version
})

export const versionUpdatedSuccess = (version) => ({
  type: actions.VERSION_UPDATED_SUCCESS,
  version
})

/*
    SITES
 */
export const siteCreatedSuccess = (newSite) => ({
  type: actions.SITE_CREATED_SUCCESS,
  site: newSite
})

export const siteReceivedSuccess = (sites) => ({
  type: actions.SITE_RECEIVED_SUCCESS,
  sites
})

export const siteDeletedSuccess = (site) => ({
  type: actions.SITE_DELETED_SUCCESS,
  site
})

export const siteUpdatedSuccess = (site) => ({
  type: actions.SITE_UPDATED_SUCCESS,
  site
})


export const logInUser = (credentials) => {
  return function(dispatch) {
    const {email, password} = credentials
    return api
      .doLogin(email, password)
      .then( response => {
        auth.saveToken(response.access_token)
        return response.access_token
      })
      .catch( error => {
        throw(error)
      })
  }
}

export const logOutUser = () => {
  auth.logOut()
  return {
    type: actions.LOGOUT
  }
}

/*
    VERSIONS
 */

export const getVersions = () => {
  return function(dispatch) {
    return api
      .getAppVersions()
      .then( response => {
        dispatch(versionReceivedSuccess(response))
      })
      .catch( error => {
        throw(error)
      })
  }
}

export const createVersion = (newVersion) => {
  return function(dispatch) {
    return api
      .createAppVersions(newVersion)
      .then( response => {
        dispatch(versionCreatedSuccess(response))
      })
      .catch( error => {
        throw(error)
      })
  }
}

export const deleteVersion = (deleteVersion) => {
  return function(dispatch) {
    return api
      .deleteAppVersions(deleteVersion)
      .then( response => {
        dispatch(versionDeletedSuccess(response))
      })
      .catch( error => {
        throw(error)
      })
  }
}

export const updateVersion = (updateVersion) => {
  return function(dispatch) {
    return api
      .updateAppVersions(updateVersion)
      .then( response => {
        dispatch(versionUpdatedSuccess(response))
      })
      .catch( error => {
        throw(error)
      })
  }
}

/*
    SITES
 */
export const getSites = () => {
  return function(dispatch) {
    return api
      .getSites()
      .then( response => {
        dispatch(siteReceivedSuccess(response))
      })
      .catch( error => {
        throw(error)
      })
  }
}

export const createSite = (newSite) => {
  return function(dispatch) {
    return api
      .createSites(newSite)
      .then( response => {
        dispatch(siteCreatedSuccess(response))
      })
      .catch( error => {
        throw(error)
      })
  }
}

export const deleteSite = (deleteSite) => {
  return function(dispatch) {
    return api
      .deleteSites(deleteSite)
      .then( response => {
        dispatch(siteDeletedSuccess(response))
      })
      .catch( error => {
        throw(error)
      })
  }
}

export const updateSite = (updateSite) => {
  return function(dispatch) {
    updateSite.testconfig = updateSite.testconfig.map( conf => {
      conf.traffic = parseInt(conf.traffic)
      return conf
    })
    return api
      .updateSites(updateSite)
      .then( response => {
        dispatch(siteUpdatedSuccess(response))
      })
      .catch( error => {
        throw(error)
      })
  }
}
