import React, {PropTypes} from 'react'
import { Link, IndexLink } from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as sessionActions from '../../actions/creators'


class Header extends React.Component {
  constructor(props) {
    super()
    this.logOut = this.logOut.bind(this)
  }

  logOut(event) {
    event.preventDefault();
    this.props.actions.logOutUser()
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Beerder</a>
          </div>
          <div id="navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><IndexLink to="/versions" activeClassName="active">Versions</IndexLink></li>
              <li><Link to="/sites" activeClassName="active">Sites</Link></li>
              <li><a href="/logout" onClick={this.logOut}>Logout</a></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

Header.propTypes = {
  actions: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  logged_in: state.session
})

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
