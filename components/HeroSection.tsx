'use client'

export default function HeroSection() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section id="home" className="hero-section">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="hero-video"
      >
        <source src="/herovideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Search The Right Truck
        </h1>
        <p className="hero-subtitle">
          Find certified used trucks by brand, body type or budget in just a few taps.
        </p>
      </div>
    </section>
  )
}
