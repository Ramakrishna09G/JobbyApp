import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiOutlineHome} from 'react-icons/ai'
import {BsBriefcase} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <div className="nav-bg-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-home-img"
          />
        </Link>
        <ul className="links-sm-container">
          <li>
            <Link to="/" className="nav-link">
              <AiOutlineHome className="nav-item" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              <BsBriefcase className="nav-item" />
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="sm-log-out-btn"
              onClick={onClickLogout}
            >
              <FiLogOut className="nav-item" />
            </button>
          </li>
        </ul>
        <ul className="links-lg-container">
          <li className="home-item">
            <Link to="/" className="nav-link">
              <p className="home-link">Home</p>
            </Link>
          </li>
          <li className="jobs-item">
            <Link to="/jobs" className="nav-link">
              <p className="jobs-link">Jobs</p>
            </Link>
          </li>
        </ul>
        <button type="button" className="log-out-btn" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </>
  )
}

export default Header
