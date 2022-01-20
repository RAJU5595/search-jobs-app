import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <Link to="/">
        <li>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </li>
      </Link>
      <ul className="header-text-container">
        <Link to="/" className="Link-item">
          <li>
            <p>Home</p>
          </li>
        </Link>
        <Link to="/jobs" className="Link-item">
          <li>
            <p>Jobs</p>
          </li>
        </Link>
      </ul>
      <li>
        <button className="btn" onClick={onClickLogout} type="button">
          Logout
        </button>
      </li>
    </nav>
  )
}

export default withRouter(Header)
