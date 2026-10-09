import { useNavigate } from 'react-router-dom'
import collegeImg from '../assets/college-image.png'
import './home.css'

export default function Home() {
  const navigate = useNavigate()

  // Makes a dial work with mouse click and with the Enter / Space keys
  const goTo = (path) => ({
    onClick: () => navigate(path),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        navigate(path)
      }
    },
  })

  return (
    <div className="home-page-root">
      {/* HERO SECTION WITH SDMCET CAMPUS PANORAMA */}
      <section className="home-hero-section">
        <div
          className="hero-background-image"
          style={{ backgroundImage: `url(${collegeImg})` }}
        >
          <div className="hero-gradient-overlay" />
          <div className="hero-ambient-mist" />
        </div>

        <div className="hero-content-container">
          <div className="hero-text-block">
            <div className="hero-institution-pill">
              <span className="inst-dot" />
              <span>SDM College of Engineering & Technology, Dharwad</span>
            </div>
            <h1 className="hero-title">
              Autonomous Curriculum <br />
              <span className="highlight-text">Syllabus Formatter</span>
            </h1>
            <p className="hero-tagline">
              An intelligent, schema-driven academic platform engineered to author, validate, and generate
              standardized syllabus documents adhering to Outcome-Based Education (OBE) and SDMCET BoS standards.
            </p>

            <div className="hero-stats-row">
              <div className="hero-stat-card">
                <span className="stat-value">8</span>
                <span className="stat-label">UG Engineering Programmes</span>
              </div>
              <div className="hero-stat-card">
                <span className="stat-value">6</span>
                <span className="stat-label">PG Master's Programmes</span>
              </div>
            </div>
          </div>

          {/* CIRCULAR PROGRAMME DIALS */}
          <div className="hero-interactive-dials" aria-label="Quick jump to programmes">
            {/* UG Circular Dial */}
            <div
              className="programme-circle-dial dial-ug"
              {...goTo('/ug')}
              role="button"
              tabIndex={0}
              title="Click to view Undergraduate Courses"
            >
              <div className="circle-pulse-ring" />
              <div className="circle-inner-content">
                <span className="circle-badge">UG</span>
                <span className="circle-name">Undergraduate</span>
                <small className="circle-desc">B.E. (8 Disciplines)</small>
                <span className="circle-arrow">→</span>
              </div>
            </div>

            {/* PG Circular Dial */}
            <div
              className="programme-circle-dial dial-pg"
              {...goTo('/pg')}
              role="button"
              tabIndex={0}
              title="Click to view Postgraduate Courses"
            >
              <div className="circle-pulse-ring" />
              <div className="circle-inner-content">
                <span className="circle-badge">PG</span>
                <span className="circle-name">Postgraduate</span>
                <small className="circle-desc">M.Tech & MBA (6)</small>
                <span className="circle-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
