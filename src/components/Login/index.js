import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
      console.log(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
      console.log(data.errorMsg)
    }
  }

  renderUsernameInputField = () => {
    const {username} = this.state

    return (
      <>
        <label className="label-name" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          onChange={this.onChangeUsername}
          value={username}
          placeholder="Username"
          className="username-input-field"
        />
      </>
    )
  }

  renderPasswordInputField = () => {
    const {password} = this.state

    return (
      <>
        <label className="label-name" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          onChange={this.onChangePassword}
          value={password}
          placeholder="Password"
          className="password-input-field"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="jobby-app-bg-container">
        <div className="jobby-app-container">
          <form className="login-form-container" onSubmit={this.onSubmitForm}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo-img"
            />
            <div className="input-container">
              {this.renderUsernameInputField()}
            </div>
            <div className="input-container">
              {this.renderPasswordInputField()}
            </div>
            <div className="submit-btn-container">
              <button type="submit" className="login-btn">
                Login
              </button>
              {showSubmitError && <p className="error-msg">{`*${errorMsg}`}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
