import './App.css'
import { useState, useEffect } from 'react'

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

  useEffect(() => {
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
      {/* Cover Page */}
      <div className="cover-page">
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
                animationDelay: `${0.8 + index * 0.1}s`,
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
  )
}

export default App
