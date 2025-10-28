import './App.css'
import { useState, useEffect } from 'react'

// Configuration constant for number of available backdrop images
const BACKDROP_COUNT = 12

interface NavLink {
  label: string
  link: string
  image?: string
  imageAlt?: string
  imageZoom?: number
  color: string
  opacity?: number
}

function App() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([])
  const [animationStarted, setAnimationStarted] = useState(false)
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState<number | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string>('')

  useEffect(() => {
    // Select random backdrop image
    const randomBackdropNumber = Math.floor(Math.random() * BACKDROP_COUNT) + 1
    setBackgroundImage(`/backdrops/${randomBackdropNumber}.jpg`)

    // Load navigation links from JSON file with cache busting
    const timestamp = new Date().getTime()
    fetch(`/links.json?v=${timestamp}`)
      .then(response => response.json())
      .then((data: NavLink[]) => setNavLinks(data))
      .catch(error => console.error('Error loading navigation links:', error))

    // Start animations after a brief delay
    const timer = setTimeout(() => {
      setAnimationStarted(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])


  const handleNavClick = (link: string) => {
    if (link.startsWith('mailto:')) {
      window.location.href = link
    } else {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  const handleTouchStart = (index: number) => {
    setHoveredLinkIndex(index)
  }

  const handleTouchEnd = () => {
    setHoveredLinkIndex(null)
  }

  return (
    <div className="app">
      {/* Background overlay for opacity control */}
      {backgroundImage && (
        <>
          <div 
            className="background-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              opacity: 0.2,
              zIndex: -3
            }}
          />
          <div 
            className="background-mask"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#efefef',
              opacity: 0.2,
              zIndex: -2
            }}
          />
          <div 
            className="background-gradient"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'linear-gradient(to bottom, transparent 20%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.7) 60%, white 100%)',
              zIndex: -1
            }}
          />
        </>
      )}
      
      {/* Cover Page */}
      <div className="cover-page">
        <div className="main-content">
          <div
            className={`cover-header ${animationStarted ? 'animate-fall' : ''}`}
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
          >
            <h1>
              jon madison
              {/* {isHovered && (
                <img
                  src="/bowtie.png"
                  alt="bowtie"
                  className="bowtie"
                />
              )} */}
            </h1>
          </div>

          {/* Navigation Links */}
          <div className={`nav-links ${animationStarted ? 'animate-rise' : ''}`}>
            {navLinks.map((navLink, index) => (
              <div
                key={navLink.label}
                className={`nav-link ${hoveredLinkIndex === index ? 'touch-hovered' : ''}`}
                style={{ 
                  animationDelay: `${1.2 + index * 0.15}s`,
                  '--hover-color': navLink.color,
                  '--hover-opacity': navLink.opacity || 0.15,
                  '--image-zoom': navLink.imageZoom || 1.1
                } as React.CSSProperties & { '--hover-color': string; '--hover-opacity': number; '--image-zoom': number }}
                onClick={() => handleNavClick(navLink.link)}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={handleTouchEnd}
                title={navLink.label}
              >
                {navLink.image && <img src={navLink.image} alt={navLink.imageAlt || navLink.label} />}
                <span>{navLink.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
