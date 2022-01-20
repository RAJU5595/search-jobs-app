import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  submitFormDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else if (response.status === 400) {
      const data = await response.json()
      this.setState({showErrorMsg: true, errorMsg: data.error_msg})
    }
  }

  getUserName = event => {
    this.setState({username: event.target.value})
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container-login">
        <div className="bg-card-login">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form onSubmit={this.submitFormDetails} className="form-container">
            <label htmlFor="username">USERNAME</label>
            <input
              onChange={this.getUserName}
              className="input-field"
              id="username"
              placeholder="Username"
              type="text"
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              className="input-field"
              onChange={this.getPassword}
              id="password"
              placeholder="Password"
              type="password"
            />
            <button className="login-btn" type="submit">
              Login
            </button>
            {showErrorMsg ? <p>* {errorMsg}</p> : null}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
