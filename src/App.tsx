import './App.css'
import { useState, useEffect } from 'react'

// Configuration for available backdrops (images and videos)
const BACKDROPS = [
  { type: 'image', file: '1.jpg', meta: 'seatac airport, 35mm film' },
  { type: 'image', file: '2.jpg', meta: 'virginia, mobile' },
  { type: 'image', file: '3.jpg', meta: 'CDG france, polaroid spectra film' },
  { type: 'image', file: '4.jpg', meta: 'washington state, mobile' },
  { type: 'image', file: '6.jpg', meta: 'san francisco, mobile' },
  { type: 'video', file: '8.webm', meta: 'washington state, dji drone' },
  { type: 'video', file: '9.webm', meta: 'washington state, dji drone' },
] as const

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
  const [backdropType, setBackdropType] = useState<'image' | 'video'>('image')
  const [backgroundSource, setBackgroundSource] = useState<string>('')
  const [backdropMeta, setBackdropMeta] = useState<string>('')

  useEffect(() => {
    // Select random backdrop (image or video)
    const randomIndex = Math.floor(Math.random() * BACKDROPS.length)
    const selectedBackdrop = BACKDROPS[randomIndex]
    setBackdropType(selectedBackdrop.type)
    setBackgroundSource(`/backdrops/${selectedBackdrop.file}`)
    setBackdropMeta(selectedBackdrop.meta)

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
      {backgroundSource && (
        <>
          {/* Conditional rendering: Video or Image backdrop */}
          {backdropType === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
                opacity: 1,
                zIndex: -3
              }}
            >
              <source src={backgroundSource} type="video/webm" />
            </video>
          ) : (
            <div 
              className="background-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${backgroundSource})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                opacity: 0.8,
                zIndex: -3
              }}
            />
          )}
          
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
          <nav className={`nav-links ${animationStarted ? 'animate-rise' : ''}`} aria-label="Main navigation">
            {navLinks.map((navLink, index) => (
              <a
                key={navLink.label}
                href={navLink.link}
                className={`nav-link ${hoveredLinkIndex === index ? 'touch-hovered' : ''}`}
                style={{ 
                  animationDelay: `${1.2 + index * 0.15}s`,
                  '--hover-color': navLink.color,
                  '--hover-opacity': navLink.opacity || 0.15,
                  '--image-zoom': navLink.imageZoom || 1.1
                } as React.CSSProperties & { '--hover-color': string; '--hover-opacity': number; '--image-zoom': number }}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(navLink.link)
                }}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={handleTouchEnd}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleNavClick(navLink.link)
                  }
                }}
                target={navLink.link.startsWith('mailto:') ? undefined : '_blank'}
                rel={navLink.link.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                aria-label={`${navLink.label}${navLink.link.startsWith('mailto:') ? ' - Send email' : ' - Opens in new tab'}`}
                tabIndex={0}
              >
                {navLink.image && <img src={navLink.image} alt="" role="presentation" />}
                <span>{navLink.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        {backdropMeta && (
          <div style={{ marginBottom: '4px', fontSize: '11px', opacity: 0.9 }}>
            {backdropMeta}
          </div>
        )}
        backdrop photos and videos shot by jon madison
      </footer>
    </div>
  )
}

export default App
