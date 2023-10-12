import {Component} from 'react'
import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'

import Header from '../Header/index'
import ProfileSection from '../ProfileSection/index'
import JobCard from '../JobCard/index'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    activeEmploymentTypeIdList: [],
    searchInput: '',
    activeSalaryRangeId: '',
  }

  componentDidMount() {
    this.getAllJobs()
  }

  getAllJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {
      activeEmploymentTypeIdList,
      activeSalaryRangeId,
      searchInput,
    } = this.state
    const employmentType = activeEmploymentTypeIdList.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobCard = jobDetails => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <>
        <li className="job-card">
          <Link to={`/jobs/${id}`} className="link-item">
            <div className="company-logo-title-card">
              <img
                src={companyLogoUrl}
                alt="company logo"
                className="company-logo"
              />
              <div className="title-card">
                <h1 className="title">{title}</h1>
                <div className="rating-card">
                  <AiFillStar className="rating-star" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-job-type-lpa-card">
              <div className="location-and-jop-type-card">
                <div className="location-card">
                  <HiLocationMarker className="location-img" />
                  <p className="location">{location}</p>
                </div>
                <div className="employment-card">
                  <BsBriefcaseFill className="briefcase-img" />
                  <p className="employment-type">{employmentType}</p>
                </div>
              </div>
              <p className="package-per-annum">{packagePerAnnum}</p>
            </div>
            <hr className="hr-line" />
            <h1 className="description-heading">Description</h1>
            <p className="job-description">{jobDescription}</p>
          </Link>
        </li>
      </>
    )
  }

  renderJobsListView = () => {
    const {jobsList} = this.state
    const isJobsListEmpty = jobsList.length > 0

    return isJobsListEmpty ? (
      <ul className="jobs-list-container">
        {jobsList.map(eachItem => (
          <JobCard jobDetails={eachItem} key={eachItem.id} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  onClickRetryJobs = () => {
    this.getAllJobs()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.value}, this.getAllJobs)
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getAllJobs()
    }
  }

  onClickSearchIcon = () => {
    this.getAllJobs()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getAllJobs)
  }

  onChangeEmploymentId = event => {
    const {activeEmploymentTypeIdList} = this.state

    if (event.target.checked) {
      const isTrue = activeEmploymentTypeIdList.filter(eachItem => {
        if (eachItem !== event.target.value) {
          return true
        }
        return false
      })
      if (isTrue) {
        activeEmploymentTypeIdList.push(event.target.value)
      }
    }

    this.setState({activeEmploymentTypeIdList}, this.getAllJobs)
  }

  render() {
    return (
      <div className="jobby-jobs-app-container">
        <Header />
        <div className="jobs-bg-container">
          <div className="search-sm-container">
            <input
              type="search"
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onEnterSearchInput}
              className="search-input"
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={this.onClickSearchIcon}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="profile-section-and-job-type-select-container">
            <ProfileSection />
            <hr />
            <ul className="employment-type-list-container">
              <h1 className="employment-heading">Type of Employment</h1>
              {employmentTypesList.map(eachItem => (
                <li
                  className="employment-type-item"
                  key={eachItem.employmentTypeId}
                >
                  <input
                    type="checkbox"
                    id={eachItem.employmentTypeId}
                    value={eachItem.employmentTypeId}
                    onChange={this.onChangeEmploymentId}
                    className="employment-input"
                  />
                  <label
                    className="employment-label"
                    htmlFor={eachItem.employmentTypeId}
                  >
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <ul className="salary-range-list-container">
              <h1 className="salary-range-heading">Salary Range</h1>
              {salaryRangesList.map(eachItem => (
                <li className="salary-range-item" key={eachItem.salaryRangeId}>
                  <input
                    type="radio"
                    id={eachItem.salaryRangeId}
                    value={eachItem.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                    name="salaryRange"
                    className="salary-range-input"
                  />
                  <label
                    className="salary-label"
                    htmlFor={eachItem.salaryRangeId}
                  >
                    {eachItem.label}
                  </label>
                  <br />
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-list-bg-container">
            <div className="search-lg-container">
              <input
                type="search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
                className="search-input"
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderAllJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
