import {Link} from 'react-router-dom'

import Header from '../Header/index'

import './index.css'

const Home = () => (
  <div className="jobby-home-bg-container">
    <Header />
    <div className="home-bg-container">
      <h1 className="home-main-heading">Find The Job That Fits Your Life</h1>
      <p className="home-description">
        Millions of people are searching for jobs,salary information, company
        reviews,Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs">
        <button type="button" className="find-jobs-btn">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
