import './App.css'
import { useState, useEffect } from 'react'

// Available backdrop images (matching test4.html's cycling logic)
const BACKDROP_IMAGES = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '6.jpg'] as const

interface NavLink {
  label: string
  link: string
  image?: string
  color: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Work', link: 'https://work.jonmadison.com', image: '/bowtie.png', color: '#CDF4D3' },
  { label: 'Music', link: 'https://madi.dj', image: '/turntable_icon.jpg', color: '#DCCCFF' },
  { label: 'LinkedIn', link: 'https://linkedin.com/in/jonmadison', image: '/linkedin.svg?v2', color: '#FFECBD' },
  { label: 'Instagram', link: 'https://instagram.com/jonmadison', image: '/ig.png', color: '#FFC7C2' },
  { label: 'Email', link: 'mailto:me@jonmadison.com', image: '/email.png', color: '#C2E5FF' },
]

function App() {
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    // STEP 1: Select random backdrop image on load
    const randomIndex = Math.floor(Math.random() * BACKDROP_IMAGES.length)
    const selectedImage = BACKDROP_IMAGES[randomIndex]
    setBackgroundImage(`/backdrops/${selectedImage}`)

    // Start animations after a brief delay (matching test4.html)
    const timer = setTimeout(() => {
      setAnimationStarted(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className="app"
      style={{
        margin: 0,
        background: `linear-gradient(rgba(128,128,128,.2), rgba(128,128,128,.8)), url(${backgroundImage}) center/cover no-repeat fixed`,
        height: '100vh',
        fontFamily: "'Poppins', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingBottom: '128px' // Shifts content up by 64px (64px * 2 for centering)
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Main heading with blend mode */}
        <h1 
          className={`blend-text ${animationStarted ? 'animate-fall' : ''}`}
          style={{
            margin: 0,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: '#555',
            fontSize: '8rem',
            fontWeight: 600, 
            textAlign: 'center',
            mixBlendMode: 'color-dodge',
            transform: animationStarted ? undefined : 'translateY(-100vh)',
            opacity: animationStarted ? undefined : 0
          }}
        >
          jon madison
        </h1>

        {/* Navigation Links */}
        <nav 
          className={`nav-container ${animationStarted ? 'animate-rise' : ''}`}
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '20px'
          }}
        >
          {NAV_LINKS.map((navLink, index) => (
            <a
              key={navLink.label}
              href={navLink.link}
              className={`nav-link ${animationStarted ? 'show' : ''}`}
              target={navLink.link.startsWith('mailto:') ? undefined : '_blank'}
              rel={navLink.link.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.2)', // Lighter, more transparent
                border: '2px solid #555',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                position: 'relative',
                animationDelay: `${1.2 + index * 0.15}s`,
                mixBlendMode: 'color-dodge', // Same blend mode as text
                '--hover-color': navLink.color
              } as React.CSSProperties & { '--hover-color': string }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = navLink.color
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {navLink.image && (
                <img 
                  src={navLink.image} 
                  alt={navLink.label}
                  style={{
                    maxWidth: '32px',
                    maxHeight: '32px',
                    objectFit: 'contain',
                    marginTop: '-6px'
                  }}
                />
              )}
              <span style={{
                fontSize: '10px',
                fontWeight: 500,
                color: '#333',
                textAlign: 'center',
                lineHeight: 1,
                position: 'absolute',
                bottom: '12px'
              }}>
                {navLink.label}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default App
