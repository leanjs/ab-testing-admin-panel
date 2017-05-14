import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import * as actionCreators from '../../actions/creators'
import ModalYN from '../common/ModalYN'
const ReactToastr = require("react-toastr")

const {ToastContainer} = ReactToastr
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

class VersionPage extends React.Component {

  constructor () {
    super()
    this.state = {
      newVersion: { idApp: '', description: '' },
      disableSave: true,
      showModalDelete: false,
      showModalEdit: false,
      changeVersion: ''
    }
    this.onChange = this.onChange.bind(this)
    this.onChangeDesc = this.onChangeDesc.bind(this)
    this.onSave = this.onSave.bind(this)
    this.checkFields = this.checkFields.bind(this)
  }

  onChange(event) {
    const field = event.target.name
    const newVersion = this.state.newVersion
    newVersion[field] = event.target.value

    this.setState({ newVersion: newVersion })
    this.setState({ disableSave: this.checkFields() })
  }

  onChangeDesc(event) {
    const field = event.target.name
    const changeVersion = this.state.changeVersion
    changeVersion[field] = event.target.value

    this.setState({ changeVersion: changeVersion })
  }

  onSave(event) {
    event.preventDefault()
    this.props.actions.createVersion(this.state.newVersion)
      .then(() => {
        this.refs.container.success(
          'Version created successfully!',
          'SUCCESS',
          { timeOut: 10000 }
        )
        this.setState({ newVersion: { idApp: '', description: '' } })
      }).catch( () => {
        this.refs.container.error(
          'Failed to create a version',
          'Oops! Something went wrong',
          { timeOut: 10000 }
        )
      })
  }

  onDelete(event) {
    event.preventDefault()
    this.props.actions.deleteVersion(this.state.changeVersion)
      .then(() => {
        this.closeModalYN('delete')
        this.refs.container.success(
          'Version deleted successfully!',
          'SUCCESS',
          { timeOut: 10000 }
        )
        this.setState({ changeVersion: '' })
      }).catch( () => {
      this.refs.container.error(
        'Failed to delete a version',
        'Oops! Something went wrong',
        { timeOut: 10000 }
      )
    })
  }

  onUpdate(event) {
    event.preventDefault()
    this.props.actions.updateVersion(this.state.changeVersion)
      .then(() => {
        this.closeModalYN('edit')
        this.refs.container.success(
          'Version updated successfully!',
          'SUCCESS',
          { timeOut: 10000 }
        )
        this.setState({ changeVersion: '' })
      }).catch( () => {
      this.refs.container.error(
        'Failed to update a version',
        'Oops! Something went wrong',
        { timeOut: 10000 }
      )
    })
  }

  selectVersion(version, option) {
    this.setState({ changeVersion: {id: version.id, description: version.description} })
    this.openModalYN(option)
  }

  checkFields() {
    return this.state.newVersion.idApp === ''
    || this.state.newVersion.description === ''
    || this.props.versions.filter( version => {
        return version.id === this.state.newVersion.idApp
      }).length > 0
  }

  closeModalYN(type) {
    this.setState(
      type === 'delete'
      ? { showModalDelete: false }
      : { showModalEdit: false }
    )
  }

  openModalYN(type) {
    this.setState(
      type === 'delete'
        ? { showModalDelete: true }
        : { showModalEdit: true }
    )
  }

  componentDidMount() {
    this.props.actions.getVersions()
  }

  render () {
    const tbody = this.props.versions.map( (version, index) => (
      <tr key={index}>
        <th>
          <span>{index + 1}</span>
        </th>
        <td>
          <span>{version.id}</span>
        </td>
        <td>
          <span>{version.description}</span>
        </td>
        <td>
          <span>{moment(new Date(version.created_at)).fromNow()}</span>
        </td>
        <td>
          <span>{moment(new Date(version.updated_at)).fromNow()}</span>
        </td>
        <td>
          <span>
            <button className="btn btn-primary btn-xs" onClick={this.selectVersion.bind(this, version, 'edit')}>
              <span className="glyphicon glyphicon-pencil"></span>
            </button>
          </span>
        </td>
        <td>
          <span>
            <button className="btn btn-danger btn-xs" onClick={this.selectVersion.bind(this, version, 'delete')}>
            <span className="glyphicon glyphicon-trash"></span>
            </button>
          </span>
        </td>
      </tr>
    ))

    const editModal = (
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              required=""
              value={this.state.changeVersion.id}
              disabled="true"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              required=""
              name="description"
              value={this.state.changeVersion.description}
              onChange={this.onChangeDesc}
            />
          </div>
        </div>
      </div>
    )

    return (
      <div className="panel panel-default" style={{ 'padding': '10px 0 0 0' }}>
        <ToastContainer
          ref="container"
          toastMessageFactory={ToastMessageFactory}
          className="toast-top-right"
        />
        <ModalYN
          showModal={this.state.showModalDelete}
          close={this.closeModalYN.bind(this, 'delete')}
          doAction={this.onDelete.bind(this)}
          title={`Delete Version ${this.state.changeVersion.id}`}
          textModal={'Are you sure to delete this version ?'}
        />
        <ModalYN
          showModal={this.state.showModalEdit}
          close={this.closeModalYN.bind(this, 'edit')}
          doAction={this.onUpdate.bind(this)}
          title={`Edit Version ${this.state.changeVersion.id}`}
          textModal={editModal}
        />

        <div className="panel-heading">Add Version</div>

        <div className="row" style={{'margin': '11px 0 0 0'}}>
          <div className="col-md-3">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                required=""
                name="idApp"
                value={this.state.newVersion.idApp}
                onChange={this.onChange}
              />
              <span className="help-block">Choose a name for your version.</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                required=""
                name="description"
                value={this.state.newVersion.description}
                onChange={this.onChange}
              />
              <span className="help-block">Choose a description for your version.</span>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <button
                className="btn btn-success btn-icon"
                style={{'margin': '25px 0 0 0', 'width': '100%'}}
                onClick={this.onSave}
                disabled={this.state.disableSave}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>

        <div className="panel-heading">Panel Versions</div>
        <table className="table table-bordred table-striped tableSection">
          <thead>
            <tr>
              <th><span>#</span></th>
              <th><span>Name</span></th>
              <th><span>Description</span></th>
              <th><span>Creation Date</span></th>
              <th><span>Last Change</span></th>
              <th><span>Modify</span></th>
              <th><span>Delete</span></th>
            </tr>
          </thead>
          <tbody>
            {tbody}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  versions: state.versionData
})


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VersionPage)
