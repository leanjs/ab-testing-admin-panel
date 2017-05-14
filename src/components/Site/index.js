import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions/creators'
import ModalYN from '../common/ModalYN'
const ReactToastr = require("react-toastr")
const Multiselect = require('react-bootstrap-multiselect')

const {ToastContainer} = ReactToastr
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

class SitePage extends React.Component {

  constructor () {
    super()
    this.state = {
      newSite: { url: '', language: '' },
      disableSave: true,
      disableEdit: true,
      showModalDelete: false,
      showModalActivate: false,
      showModalEdit: false,
      changeSite: {},
      versionList: []
    }
    this.onChange = this.onChange.bind(this)
    this.onChangeMChoice = this.onChangeMChoice.bind(this)
    this.onChangeEdit = this.onChangeEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.checkFields = this.checkFields.bind(this)
  }

  onChange(event) {
    const field = event.target.name
    const newSite = this.state.newSite
    newSite[field] = event.target.value

    this.setState({ newSite: newSite })
    this.setState({ disableSave: this.checkFields() })
  }

  onChangeMChoice(option, checked) {
    const versionList = this.state.versionList.map(version => {
      if (option.html() === version.version) version.selected = checked
      return version
    })
    const changeSite = this.state.changeSite
    if (checked) {
      changeSite.testconfig = [...changeSite.testconfig, {version: option.html(), traffic: 0}]
    } else {
      changeSite.testconfig = changeSite.testconfig.filter(version => (version.version !== option.html()))
    }

    this.setState({ versionList: versionList})
    this.setState({ changeSite: changeSite})
    this.refs.myRef.syncData()
    this.setState({ disableEdit: this.checkFieldsEdit() })
  }

  onChangeEdit(event) {
    const field = event.target.name
    const changeSite = this.state.changeSite
    changeSite[field] = event.target.value

    this.setState({ changeSite: changeSite })
    this.setState({ disableEdit: this.checkFieldsEdit() })
  }

  onChangeEditTraffic(version, event) {
    const changeSite = this.state.changeSite
    changeSite.testconfig = changeSite.testconfig.map( conf => {
      if (conf.version === version) conf.traffic = event.target.value
      return conf
    })

    this.setState({ changeSite: changeSite })
    this.setState({ disableEdit: this.checkFieldsEdit() })
  }
  
  onSave(event) {
    event.preventDefault()
    this.props.actions.createSite(this.state.newSite)
      .then(() => {
        this.refs.container.success(
          'Site created successfully!',
          'SUCCESS',
          { timeOut: 10000 }
        )
        this.setState({ newSite: { url: '', language: '' } })
      }).catch( () => {
      this.refs.container.error(
        'Failed to create a site',
        'Oops! Something went wrong',
        { timeOut: 10000 }
      )
    })
  }

  onUpdate(toggleActivate) {
    if (toggleActivate) this.state.changeSite.active = !this.state.changeSite.active
    this.props.actions.updateSite(this.state.changeSite)
      .then(() => {
        this.closeModalYN(toggleActivate ? 'activate' : 'edit')
        this.refs.container.success(
          'Site edit successfully!',
          'SUCCESS',
          { timeOut: 10000 }
        )
      }).catch( () => {
      this.refs.container.error(
        'Failed to edit a site',
        'Oops! Something went wrong',
        { timeOut: 10000 }
      )
    })
  }

  onDelete(event) {
    event.preventDefault()
    this.props.actions.deleteSite(this.state.changeSite)
      .then(() => {
        this.closeModalYN('delete')
        this.refs.container.success(
          'Site deleted successfully!',
          'SUCCESS',
          { timeOut: 10000 }
        )
        this.setState({ changeSite: '' })
      }).catch( () => {
      this.refs.container.error(
        'Failed to delete a site',
        'Oops! Something went wrong',
        { timeOut: 10000 }
      )
    })
  }

  selectSite(site, option) {
    if (option !== 'edit') {
      this.setState({
        changeSite: {
          id: site.id, url: site.url, language: site.language,
          testconfig: site.testconfig, active: site.active
        }
      })
    }

    if (option === '') {
      const versionsActive = site.testconfig.map( conf => (conf.version))
      const versionList = this.props.versions.map( version => ({
        version: version.id,
        value: version.id,
        selected: versionsActive.indexOf(version.id) !== -1
      }))

      this.setState({ versionList: versionList})
    }
    this.openModalYN(option)
  }

  checkFields() {
    return this.state.newSite.url === ''
      || this.props.sites.filter( site => {
        return site.url === this.state.newSite.url
        && site.language === this.state.newSite.language
      }).length > 0
  }

  checkFieldsEdit() {
    return this.state.changeSite.url === ''
      || this.props.sites.filter( site => {
          return site.url === this.state.changeSite.url
            && site.language === this.state.changeSite.language
            && site.id !== this.state.changeSite.id
          }).length > 0
      || this.state.changeSite.testconfig.length === 0
      || this.state.changeSite.testconfig
        .map(conf => (parseInt(conf.traffic)))
        .reduce((a, b) => (a+b)) !== 100
  }

  closeModalYN(type) {
    let modal = {}
    switch (type) {
      case 'delete':
        modal = { showModalDelete: false }
        break
      case 'activate':
        modal = { showModalActivate: false }
        break
      case 'edit':
        modal = { showModalEdit: false }
        break
      default:
        break
    }
    this.setState(modal)
  }

  openModalYN(type) {
    let modal = {}
    switch (type) {
      case 'delete':
        modal = { showModalDelete: true }
        break
      case 'activate':
        modal = { showModalActivate: true }
        break
      case 'edit':
        modal = { showModalEdit: true }
        break
      default:
        break
    }
    this.setState(modal)
  }

  deleteSiteConfig (version) {
    let changeSite = this.state.changeSite
    changeSite.testconfig = this.state.changeSite.testconfig.filter(conf => (conf.version !== version))
    this.setState({ changeSite: changeSite })
  }

  componentDidMount() {
    this.props.actions.getSites()
    this.props.actions.getVersions()
  }

  render () {
    const tbodySite = this.props.sites.map( (site, index) => (
      <tr key={index}>
        <th>
          <span>{index + 1}</span>
        </th>
        <td>
          <span>{site.url}</span>
        </td>
        <td>
          <span>{site.language}</span>
        </td>
        <td>
          <span>
          {
            site.active
              ? (
                  <button className="btn btn-success btn-xs" onClick={this.selectSite.bind(this, site, 'activate')}>
                    <span className="glyphicon glyphicon-thumbs-up"></span>
                  </button>
                )
              : (
                  <button className="btn btn-warning btn-xs" onClick={this.selectSite.bind(this, site, 'activate')}>
                    <span className="glyphicon glyphicon-thumbs-down"></span>
                  </button>
              )
          }
          </span>
        </td>
        <td>
          <span>
            <button className="btn btn-primary btn-xs" onClick={this.selectSite.bind(this, site, '')}>
              <span className="glyphicon glyphicon-pencil"></span>
            </button>
          </span>
        </td>
        <td>
          <span>
            <button className="btn btn-danger btn-xs" onClick={this.selectSite.bind(this, site, 'delete')}>
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          </span>
        </td>
      </tr>
    ))
    
    let editSite = (<div></div>)
    let editSiteRow2 = (<div></div>)
    let editSiteConf = (<div></div>)

    if (this.state.changeSite.testconfig) {
      const tbodySiteConfig = this.state.changeSite.testconfig.map( (siteConfig, index) => (
        <tr key={index}>
          <th>
            <span>{index + 1}</span>
          </th>
          <td>
            <span>{siteConfig.version}</span>
          </td>
          <td>
            <div className="input-group bootstrap-touchspin">
              <span className="input-group-btn" style={{display: 'none'}}>
                <button className="btn btn-default bootstrap-touchspin-down" type="button">-</button>
              </span>
              <span className="input-group-addon bootstrap-touchspin-prefix"></span>
              <input type="text" name="traffic"
                     value={this.state.changeSite.testconfig[index].traffic}
                     onChange={this.onChangeEditTraffic.bind(this, siteConfig.version)}
              />
              <span className="input-group-addon bootstrap-touchspin-postfix">%</span>
              <span className="input-group-btn" style={{display: 'none'}}>
                <button className="btn btn-default bootstrap-touchspin-up" type="button">+</button>
              </span>
            </div>
          </td>
          <td>
            <span>
              <button className="btn btn-danger btn-xs" onClick={this.deleteSiteConfig.bind(this, siteConfig.version)}>
                <span className="glyphicon glyphicon-trash"></span>
              </button>
            </span>
          </td>
        </tr>
      ))

      editSite = (
          <div className="row" style={{'margin': '11px 0 0 0'}}>
            <div className="col-md-3">
              <div className="form-group">
                <label>Url</label>
                <input
                  type="text"
                  className="form-control"
                  required=""
                  name="url"
                  value={this.state.changeSite.url}
                  onChange={this.onChangeEdit}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Language</label>
                <input
                  type="text"
                  className="form-control"
                  required=""
                  name="language"
                  value={this.state.changeSite.language}
                  onChange={this.onChangeEdit}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <button
                  className="btn btn-success btn-icon"
                  style={{'margin': '25px 0 0 0', 'width': '100%'}}
                  onClick={this.selectSite.bind(this, '', 'edit')}
                  disabled={this.state.disableEdit}
                >
                  UPDATE
                </button>
              </div>
            </div>
          </div>
      )

      editSiteRow2 = (
        <div className="row" style={{'margin': '11px 0 0 0'}}>
          <div className="col-md-6">
            <div className="form-group">
              <label style={{marginRight: "20px"}}>Add/Remove versions</label>
              <Multiselect onChange={this.onChangeMChoice} ref="myRef" data={this.state.versionList} multiple />
            </div>
          </div>
        </div>
      )

      editSiteConf = (
        <table className="table table-bordred table-striped tableSection">
          <thead>
            <tr>
              <th><span>#</span></th>
              <th><span>Version</span></th>
              <th><span>Traffic</span></th>
              <th><span>Delete</span></th>
            </tr>
          </thead>
          <tbody>
          {tbodySiteConfig}
          </tbody>
        </table>
      )
    }

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
          title={`Delete Site ${this.state.changeSite.url}`}
          textModal={'Are you sure to delete this site ?'}
        />
        <ModalYN
          showModal={this.state.showModalActivate}
          close={this.closeModalYN.bind(this, 'activate')}
          doAction={this.onUpdate.bind(this, true)}
          title={`${this.state.changeSite.active ? 'Deactivate' : 'Activate'} Site ${this.state.changeSite.url}`}
          textModal={`Are you sure to ${this.state.changeSite.active ? 'deactivate' : 'activate'} this site ?`}
        />
        <ModalYN
          showModal={this.state.showModalEdit}
          close={this.closeModalYN.bind(this, 'edit')}
          doAction={this.onUpdate.bind(this, false)}
          title={`Edit Site ${this.state.changeSite.url}`}
          textModal={`Are you sure to save these settings ?`}
        />


        <div className="panel-heading">Add Site</div>

        <div className="row" style={{'margin': '11px 0 0 0'}}>
          <div className="col-md-3">
            <div className="form-group">
              <label>Url</label>
              <input
                type="text"
                className="form-control"
                required=""
                name="url"
                value={this.state.newSite.url}
                onChange={this.onChange}
              />
              <span className="help-block">Choose a url for your site.</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Language</label>
              <input
                type="text"
                className="form-control"
                required=""
                name="language"
                value={this.state.newSite.language}
                onChange={this.onChange}
              />
              <span className="help-block">Choose a language for your site.</span>
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

        <div className="panel-heading">Panel Sites</div>
        <table className="table table-bordred table-striped tableSection">
          <thead>
          <tr>
            <th><span>#</span></th>
            <th><span>Url</span></th>
            <th><span>Language</span></th>
            <th><span>Active</span></th>
            <th><span>Edit</span></th>
            <th><span>Delete</span></th>
          </tr>
          </thead>
          <tbody>
          {tbodySite}
          </tbody>
        </table>

        <div className="panel-heading">Edit Panel Site: {this.state.changeSite.url}</div>
        {editSite}
        {editSiteRow2}
        <div className="panel-heading">Edit Panel Site Config</div>
        {editSiteConf}
      </div>
    )
  }

}

const mapStateToProps = state => ({
  sites: state.siteData, versions: state.versionData
})


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SitePage)
