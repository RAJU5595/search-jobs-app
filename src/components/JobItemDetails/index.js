import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import SkillsCard from '../SkillsCard'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobItemDetails extends Component {
  state = {
    jobDetailsApi: apiStatusConstants.initial,
    jobDetails: {},
    lifeAtCompany: {},
    skills: [],
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const jobDetails = {
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        companyLogoUrl: data.job_details.company_logo_url,
        employmentType: data.job_details.employment_type,
        companyWebsiteUrl: data.job_details.company_website_url,
        title: data.job_details.title,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }
      const lifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      const skills = data.job_details.skills.map(eachItem => ({
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      const similarJobs = data.similar_jobs.map(eachItem => ({
        id: eachItem.id,
        location: eachItem.location,
        title: eachItem.title,
        rating: eachItem.rating,
        jobDescription: eachItem.job_description,
        employmentType: eachItem.employment_type,
        companyLogoUrl: eachItem.company_logo_url,
      }))

      this.setState({
        jobDetailsApi: apiStatusConstants.success,
        jobDetails,
        lifeAtCompany,
        skills,
        similarJobs,
      })
    } else {
      this.setState({jobDetailsApi: apiStatusConstants.failure})
    }
  }

  renderJobDetails = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state
    const {
      title,
      companyLogoUrl,
      companyWebsiteUrl,
      jobDescription,
      employmentType,
      location,
      packagePerAnnum,
      rating,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-details-bg">
        <div className="bg-card-job-details">
          <div className="logo-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
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
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="description-container">
            <h1>Description</h1>
            <a href={companyWebsiteUrl} className="website-link">
              <p>Visit</p>
            </a>
          </div>
          <p>{jobDescription}</p>
          <h1>Skills</h1>
          <ul className="skills-container">
            {skills.map(eachItem => (
              <SkillsCard key={eachItem.name} details={eachItem} />
            ))}
          </ul>
        </div>
        <h1>Life at Company</h1>
        <div className="life-at-company-container">
          <p>{description}</p>
          <img src={imageUrl} alt="life at company" />
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobs.map(eachItem => (
            <SimilarJobCard key={eachItem.id} details={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div testid="loader" className="loader-container">
      <Loader type="TailSpin" className="loader" />
    </div>
  )

  onClickRetryBtn = () => this.getJobDetails()

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.onClickRetryBtn} type="button">
        Retry
      </button>
    </div>
  )

  renderAllJobDetails = () => {
    const {jobDetailsApi} = this.state
    switch (jobDetailsApi) {
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <Header />
        {this.renderAllJobDetails()}
      </div>
    )
  }
}

export default JobItemDetails
