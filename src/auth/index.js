class Auth {
  static loggedIn() {
    return !!sessionStorage.jwt
  }

  static logOut() {
    sessionStorage.removeItem('jwt')
  }

  static saveToken(token) {
    sessionStorage.setItem('jwt', token)
  }
}

export default Auth