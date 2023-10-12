import {Link} from 'react-router-dom'

import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props
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

export default JobCard
