import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {details} = props
  const {
    title,
    rating,
    location,
    jobDescription,
    employmentType,
    companyLogoUrl,
  } = details
  return (
    <div className="job-card-container">
      <div className="logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <h1>{title}</h1>
          <div className="rating-container">
            <AiFillStar className="star-icon" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <div className="job-role-container">
        <div className="rating-container">
          <IoLocationSharp className="icon" />
          <p>{location}</p>
        </div>
        <div className="rating-container">
          <BsFillBriefcaseFill className="icon" />
          <p>{employmentType}</p>
        </div>
      </div>
      <h1>Description</h1>
      <p>{jobDescription}</p>
    </div>
  )
}

export default SimilarJobCard
