import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobCard from '../JobCard'

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
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobsRoute extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsApiStatus: apiStatusConstants.initial,
    listOfJobs: [],
    checkedBoxes: [],
    minimumPackage: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getListOfAllJobs()
  }

  getListOfAllJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkedBoxes, minimumPackage, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkedBoxes.toString()}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedList = data.jobs.map(eachItem => ({
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
        jobsApiStatus: apiStatusConstants.success,
        listOfJobs: updatedList,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedObject = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileDetails: updatedObject,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderLoaderView = () => (
    <div testid="loader" className="loader-container">
      <Loader type="TailSpin" className="loader" />
    </div>
  )

  onClickRetryBtn = () => {
    this.setState(
      {profileApiStatus: apiStatusConstants.inProgress},
      this.getProfileDetails,
    )
  }

  renderProfileFailureView = () => (
    <div>
      <button onClick={this.onClickRetryBtn} type="button" className="btn">
        Retry
      </button>
    </div>
  )

  renderAllProfileDetails = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderJobsListView = () => {
    const {listOfJobs} = this.state
    return (
      <ul className="all-jobs-container">
        {listOfJobs.map(eachItem => (
          <JobCard key={eachItem.id} details={eachItem} />
        ))}
      </ul>
    )
  }

  onClickRetryJobs = () =>
    this.setState(
      {jobsApiStatus: apiStatusConstants.inProgress},
      this.getListOfAllJobs,
    )

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.onClickRetryJobs} className="btn" type="button">
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderAllJobs = () => {
    const {jobsApiStatus, listOfJobs} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        if (listOfJobs.length === 0) {
          return this.renderNoJobsView()
        }
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  checkboxStatus = event => {
    const {checkedBoxes} = this.state
    const checkboxList = [...checkedBoxes]
    if (event.target.checked === true) {
      checkboxList.push(event.target.id)
    } else {
      const index = checkboxList.findIndex(
        eachItem => eachItem === event.target.id,
      )
      checkboxList.splice(index, 1)
    }
    this.setState({checkedBoxes: checkboxList}, this.getListOfAllJobs)
  }

  getAnOption = event =>
    this.setState({minimumPackage: event.target.id}, this.getListOfAllJobs)

  getSearchInput = () => {
    const searchTextEl = document.getElementById('search-text')
    const searchInput = searchTextEl.value
    if (searchInput !== '') {
      this.setState({searchInput}, this.getListOfAllJobs)
    } else {
      this.setState({searchInput: ''}, this.getListOfAllJobs)
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-bg-container">
          <div className="side-bar-container">
            {this.renderAllProfileDetails()}
            <hr className="hr-line" />
            <h1>Type of Employment</h1>
            <ul className="employment-container">
              {employmentTypesList.map(eachItem => (
                <li key={eachItem.employmentTypeId}>
                  <input
                    id={eachItem.employmentTypeId}
                    className="checkbox-field"
                    type="checkbox"
                    onClick={this.checkboxStatus}
                  />
                  <label htmlFor={eachItem.employmentTypeId}>
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="hr-line" />
            <h1>Salary Range</h1>
            <ul className="employment-container">
              {salaryRangesList.map(eachItem => (
                <li key={eachItem.salaryRangeId}>
                  <input
                    id={eachItem.salaryRangeId}
                    className="checkbox-field-salary"
                    type="radio"
                    name="salary"
                    onChange={this.getAnOption}
                  />
                  <label htmlFor={eachItem.salaryRangeId}>
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="content-container">
            <div className="search-container">
              <input
                type="search"
                id="search-text"
                placeholder="Search"
                className="search-field"
              />
              <button
                className="search-icon"
                type="button"
                testid="searchButton"
                onClick={this.getSearchInput}
              >
                <BsSearch />
              </button>
            </div>
            {this.renderAllJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default JobsRoute
