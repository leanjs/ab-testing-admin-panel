import 'whatwg-fetch'
import Promise from 'es6-promise'
import { API_BASE_URL } from '../config'
Promise.polyfill()

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Request-Method': 'POST',
  'Content-Type': 'application/json'
}

const requestHeaders = () => ({
  'Authorization': `JWT ${sessionStorage.jwt}`,
  'Content-Type': 'application/json'
})

export const doLogin = (username, password) => (
  fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: defaultHeaders,
    mode: 'cors',
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(access_token => access_token)
)
/*
    VERSIONS
 */
export const getAppVersions = () => (
  fetch(`${API_BASE_URL}/versions`, {
    method: 'GET',
    headers: requestHeaders(),
    mode: 'cors'
  })
    .then(response => response.json())
    .then(versions => versions)
)

export const createAppVersions = ({idApp, description}) => (
  fetch(`${API_BASE_URL}/versions`, {
    method: 'POST',
    headers: requestHeaders(),
    mode: 'cors',
    body: JSON.stringify({ id: idApp, description })
  })
    .then(response => response.json())
    .then(version => version)
)

export const deleteAppVersions = ({id}) => (
  fetch(`${API_BASE_URL}/versions/${id}`, {
    method: 'DELETE',
    headers: requestHeaders(),
    mode: 'cors'
  })
    .then(response => response.json())
    .then(version => version)
)

export const updateAppVersions = ({id, description}) => (
  fetch(`${API_BASE_URL}/versions/${id}`, {
    method: 'PUT',
    headers: requestHeaders(),
    mode: 'cors',
    body: JSON.stringify({ id, description })
  })
    .then(response => response.json())
    .then(version => version)
)

/*
    SITES
 */
export const getSites = () => (
  fetch(`${API_BASE_URL}/sites`, {
    method: 'GET',
    headers: requestHeaders(),
    mode: 'cors'
  })
    .then(response => response.json())
    .then(versions => versions)
)

export const createSites = ({url, language}) => (
  fetch(`${API_BASE_URL}/sites`, {
    method: 'POST',
    headers: requestHeaders(),
    mode: 'cors',
    body: JSON.stringify({ url, language, active: false, testconfig: [] })
  })
    .then(response => response.json())
    .then(version => version)
)

export const deleteSites = ({id}) => (
  fetch(`${API_BASE_URL}/sites/${id}`, {
    method: 'DELETE',
    headers: requestHeaders(),
    mode: 'cors'
  })
    .then(response => response.json())
    .then(version => version)
)

export const updateSites = ({id, url, language, active, testconfig}) => (
  fetch(`${API_BASE_URL}/sites/${id}`, {
    method: 'PUT',
    headers: requestHeaders(),
    mode: 'cors',
    body: JSON.stringify({ url, language, active, testconfig })
  })
    .then(response => response.json())
    .then(version => version)
)