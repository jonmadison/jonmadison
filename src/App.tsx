import "./App.css";
import { useState, useEffect } from "react";

// Available backdrops (images and videos)
const BACKDROPS = [
  {
    file: "1.jpg",
    type: "image",
    description: "seatac, 35mm film",
    color: "#666",
    mixBlendMode: "color-dodge",
  },
  {
    file: "2.jpg",
    type: "image",
    description: "central virginia, mobile",
    color: "#666",
    mixBlendMode: "color-dodge",
  },
  {
    file: "3.jpg",
    type: "image",
    description: "charles de gaulle, france, polaroid",
    color: "#666",
    mixBlendMode: "color-dodge",
  },
  {
    file: "4.jpg",
    type: "image",
    description: "washington state, mobile",
    color: "#666",
    mixBlendMode: "screen",
  },
  {
    file: "9.jpg",
    type: "image",
    description: "san francisco, CA, mobile",
    color: "#666",
    mixBlendMode: "color-dodge",
  },
  {
    file: "9.webm",
    type: "video",
    description: "seattle, DJI drone",
    color: "#efefef",
    mixBlendMode: "color-dodge",
  },
  {
    file: "8.webm",
    type: "video",
    description: "washington state, DJI drone",
    color: "#333",
    mixBlendMode: "color-burn",
  },
  {
    file: "10.webm",
    type: "video",
    description: "seatac, mobile",
    color: "#ccc",
    mixBlendMode: "color-dodge",
  },
] as const;

interface NavLink {
  label: string;
  link: string;
  image?: string;
  color: string;
}

const NAV_LINKS: NavLink[] = [
  {
    label: "Work",
    link: "https://work.jonmadison.com",
    image: "/bowtie.png",
    color: "#eee",
  },
  {
    label: "Music",
    link: "https://madi.dj",
    image: "/turntable_icon.jpg",
    color: "#eee",
  },
  {
    label: "LinkedIn",
    link: "https://linkedin.com/in/jonmadison",
    image: "/linkedin.svg?v2",
    color: "#eee",
  },
  {
    label: "Instagram",
    link: "https://instagram.com/jonmadison",
    image: "/ig.png",
    color: "#eee",
  },
  {
    label: "Email",
    link: "mailto:me@jonmadison.com",
    image: "/email.png",
    color: "#eee",
  },
];

function App() {
  const [backdrop, setBackdrop] = useState<{
    file: string;
    type: "image" | "video";
    description: string;
    mixBlendMode: string;
    color: string;
  } | null>(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // STEP 1: Select random backdrop (image or video) on load
    const randomIndex = Math.floor(Math.random() * BACKDROPS.length);
    const selectedBackdrop = BACKDROPS[randomIndex];
    setBackdrop(selectedBackdrop);

    // Start animations after a brief delay (matching test4.html)
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="app"
      style={{
        margin: 0,
        background:
          backdrop?.type === "image"
            ? `linear-gradient(rgba(0,0,0,.5), rgba(255,255,255,.2)), url(/backdrops/${backdrop.file}) center/cover no-repeat fixed`
            : "#222",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        paddingBottom: "128px", // Shifts content up by 64px (64px * 2 for centering)
      }}
    >
      {/* Video backdrop if type is video */}
      {backdrop?.type === "video" && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          >
            <source src={`/backdrops/${backdrop.file}`} type="video/webm" />
          </video>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(rgba(0,0,0,.8), rgba(255,255,255,.2))",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Main heading with blend mode */}
        <h1
          className={`blend-text ${animationStarted ? "animate-fall" : ""}`}
          style={{
            margin: 0,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: (backdrop?.color || "#666") as React.CSSProperties["color"],
            fontSize: "8rem",
            fontWeight: 600,
            textAlign: "center",
            mixBlendMode: (backdrop?.mixBlendMode ||
              "color-dodge") as React.CSSProperties["mixBlendMode"],
            transform: animationStarted ? undefined : "translateY(-100vh)",
            opacity: animationStarted ? undefined : 0,
          }}
        >
          jon madison
        </h1>

        {/* Navigation Links */}
        <nav
          className={`nav-container ${animationStarted ? "animate-rise" : ""}`}
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "20px",
          }}
        >
          {NAV_LINKS.map((navLink, index) => (
            <a
              key={navLink.label}
              href={navLink.link}
              className={`nav-link ${animationStarted ? "show" : ""}`}
              target={navLink.link.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                navLink.link.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
              style={
                {
                  width: "80px",
                  height: "80px",
                  borderRadius: "24px",
                  background: "rgba(200, 200, 200, 0.7)",
                  border: "1px solid #ccc",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  position: "relative",
                  animationDelay: `${1.2 + index * 0.15}s`,
                  mixBlendMode: "color-burn", // Same blend mode as text
                  "--hover-color": navLink.color,
                } as React.CSSProperties & { "--hover-color": string }
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.background = navLink.color;
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(200, 200, 200, 0.7)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {navLink.image && (
                <img
                  src={navLink.image}
                  alt={navLink.label}
                  style={{
                    maxWidth: "32px",
                    maxHeight: "32px",
                    objectFit: "contain",
                    marginTop: "-6px",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#333",
                  textAlign: "center",
                  lineHeight: 1,
                  position: "absolute",
                  bottom: "12px",
                }}
              >
                {navLink.label}
              </span>
            </a>
          ))}
        </nav>
      </div>

      {/* Backdrop caption at bottom */}
      {backdrop && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: 400,
            zIndex: 10,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ marginBottom: "4px" }}>{backdrop.description}</div>
          <div style={{ fontSize: "10px", opacity: 0.8 }}>
            all shots by jon madison
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
