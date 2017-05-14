import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as actionCreators from '../../actions/creators'


class Login extends React.Component {
  constructor () {
    super()
    this.state = { credentials: { email: '', password: '' } }
    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onChange(event) {
    const field = event.target.name
    const credentials = this.state.credentials
    credentials[field] = event.target.value
    return this.setState({ credentials: credentials })
  }

  onSave(event) {
    event.preventDefault()
    this.props.actions
      .logInUser(this.state.credentials)
      .then( token => {
        this.context.router.push('/versions')
      })
  }

  render () {
    return (
      <div className="container">
        <form className="form-signin">
          <h2 className="form-signin-heading">Please sign in</h2>
          <label className="sr-only">Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email address"
            required={true}
            autoFocus={true}
            value={this.state.credentials.email}
            onChange={this.onChange}
          />
          <label className="sr-only">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            required={true}
            value={this.state.credentials.password}
            onChange={this.onChange}
          />
          <button
            className="btn btn-lg btn-primary btn-block"
            type="submit"
            onClick={this.onSave}
          >
            Sign in
          </button>
        </form>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(Login)
