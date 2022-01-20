import './index.css'

const SkillsCard = props => {
  const {details} = props
  const {imageUrl, name} = details
  return (
    <li className="skill-container">
      <img src={imageUrl} className="skill-logo" alt={name} />
      <p>{name}</p>
    </li>
  )
}

export default SkillsCard
