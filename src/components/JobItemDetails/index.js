import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {RiExternalLinkLine} from 'react-icons/ri'

import Header from '../Header/index'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    apiStatus: apiStatusConstants.initial,
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  renderSkillsFormatted = eachItem => ({
    imageUrl: eachItem.image_url,
    name: eachItem.name,
  })

  getFormattedSimilarJobsData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,

    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getFormattedJobData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    skills: data.skills.map(eachItem => this.renderSkillsFormatted(eachItem)),
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedJobData = this.getFormattedJobData(fetchedData.job_details)
      const updatedSimilarJobs = fetchedData.similar_jobs.map(eachSimilarJob =>
        this.getFormattedSimilarJobsData(eachSimilarJob),
      )

      this.setState({
        jobItemDetails: updatedJobData,
        similarJobsList: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSkillCard = eachItem => {
    const {name, imageUrl} = eachItem

    return (
      <li className="skill-card">
        <img src={imageUrl} alt={name} className="skill-image" />
        <p className="skill-name">{name}</p>
      </li>
    )
  }

  renderJobDetailsView = () => {
    const {jobItemDetails, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItemDetails

    return (
      <div className="jobby-app-job-item-details-container">
        <Header />
        <div className="job-item-details-bg-container">
          <div className="job-card">
            <div className="company-logo-title-card">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
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
            <div className="description-and-visit-link-card">
              <h1 className="description-heading">Description</h1>
              <a href={companyWebsiteUrl} className="website-link">
                Visit
                <RiExternalLinkLine />
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
            <h1 className="skill-heading">Skills</h1>
            <ul className="skill-card-container">
              {skills.map(eachItem => (
                <li className="skill-card" key={eachItem.name}>
                  <img
                    src={eachItem.imageUrl}
                    alt={eachItem.name}
                    className="skill-image"
                  />
                  <p className="skill-name">{eachItem.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="life-at-company-main-heading">Life At Company</h1>
            <div className="life-at-company-card">
              <p className="life-at-company-description">
                {lifeAtCompany.description}
              </p>
              <img
                src={lifeAtCompany.imageUrl}
                className="life-at-company-image"
                alt="life at company"
              />
            </div>
          </div>
          <h1 className="similar-jobs-main-heading">Similar Jobs</h1>
          <ul className="similar-jobs-container">
            {similarJobsList.map(eachItem => (
              <li className="similar-job-card" key={eachItem.id}>
                <div className="company-logo-title-card">
                  <img
                    src={eachItem.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-logo"
                  />
                  <div className="title-card">
                    <h1 className="title">{eachItem.title}</h1>
                    <div className="rating-card">
                      <AiFillStar className="rating-star" />
                      <p className="rating">{eachItem.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="description-heading">Description</h1>
                <p className="job-description">{eachItem.jobDescription}</p>
                <div className="location-job-type-lpa-card">
                  <div className="location-and-jop-type-card">
                    <div className="location-card">
                      <HiLocationMarker className="location-img" />
                      <p className="location">{eachItem.location}</p>
                    </div>
                    <div className="employment-card">
                      <BsBriefcaseFill className="briefcase-img" />
                      <p className="employment-type">
                        {eachItem.employmentType}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickRetryJobs = () => {
    this.getJobDetails()
  }

  renderJobDetailsFailureView = () => (
    <div className="jobby-app-job-item-details-container">
      <div className="jobs-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="job-item-details-failure-view-img"
        />
        <h1 className="job-item-details-failure-heading">
          Oops! Something Went Wrong
        </h1>
        <p className="job-item-details-failure-description">
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
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default JobItemDetails
