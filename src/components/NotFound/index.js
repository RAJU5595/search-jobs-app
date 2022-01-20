import Header from '../Header'
import './index.css'

const text = `we're sorry, the page you requested could not be found`
const NotFound = () => (
  <div className="bg-container">
    <Header />
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1>Page Not Found</h1>
      <p>{text}</p>
    </div>
  </div>
)

export default NotFound
