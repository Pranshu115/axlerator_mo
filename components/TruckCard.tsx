'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Truck {
  id: number
  name: string
  year: number
  price: string
  mileage: string
  engine: string
  transmission: string
  location: string
  image: string
  certified: boolean
  images?: string[] // Support multiple images
}

interface TruckCardProps {
  truck: Truck
}

export default function TruckCard({ truck }: TruckCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Spinny-style helpers
  const priceNumber = (() => {
    const num = parseInt(truck.price.replace(/[^0-9]/g, ''), 10)
    return Number.isFinite(num) ? num : 0
  })()

  const emiValue = priceNumber > 0 ? Math.round(priceNumber / 60) : null

  // Get all images for this truck
  const images = truck.images && truck.images.length > 0 
    ? truck.images 
    : truck.image 
      ? [truck.image] 
      : []

  const handleViewDetails = () => {
    router.push(`/truck/${truck.id}`)
  }

  // Handle touch swipe for image carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  // Auto-advance images (optional, like Car24)
  useEffect(() => {
    if (images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <>
      <div
        className="truck-card-apple"
        onClick={handleViewDetails}
        role="button"
        tabIndex={0}
      >
        {/* Image Section with Carousel - Car24 Style */}
        <div 
          className="truck-card-image-apple"
          ref={imageContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.length > 0 ? (
            <div 
              className="truck-card-image-carousel"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="truck-card-image-slide"
                >
                  <Image
                    src={img}
                    alt={`${truck.name} - Image ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="truck-card-img"
                    priority={index === 0}
                    unoptimized={true}
                    onError={(e) => {
                      console.error('Image load error:', img)
                      // Fallback to placeholder or hide image
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="truck-card-image-placeholder">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          )}
          
          {/* Image Counter - Car24 Style */}
          {images.length > 1 && (
            <div className="truck-card-image-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Image Indicators/Dots - Car24 Style */}
          {images.length > 1 && (
            <div className="truck-card-image-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`truck-card-indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="truck-card-overlay">
            {truck.certified && (
              <span className="truck-badge-certified-apple">✓ Certified</span>
            )}
            <button 
              className="truck-favorite-btn"
              onClick={(e) => {
                e.stopPropagation()
                setIsFavorite(!isFavorite)
              }}
              aria-label="Add to favorites"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <div className="truck-card-text-overlay">
              <h3 className="truck-card-name-overlay">{truck.name}</h3>
              <p className="truck-card-subtitle-overlay">{truck.year}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="truck-card-content-apple">
          {/* Badges - Spinny style */}
          <div className="truck-card-badges">
            {truck.certified && <span className="badge-pill badge-green">Certified</span>}
          </div>

          {/* Specs */}
          <div className="truck-card-specs-apple">
            <div className="truck-spec-apple">
              <span className="truck-spec-value-apple">{truck.mileage}</span>
              <span className="truck-spec-label-apple">Mileage</span>
            </div>
            <div className="truck-spec-divider"></div>
            <div className="truck-spec-apple">
              <span className="truck-spec-value-apple">{truck.engine}</span>
              <span className="truck-spec-label-apple">Engine</span>
            </div>
            <div className="truck-spec-divider"></div>
            <div className="truck-spec-apple">
              <span className="truck-spec-value-apple">{truck.transmission}</span>
              <span className="truck-spec-label-apple">Trans</span>
            </div>
          </div>

          {/* EMI Row */}
          <div className="truck-card-emi-row">
            <div className="truck-emi-text">
              <span className="truck-emi-label">EMI starts at</span>
              <span className="truck-emi-value">
                {emiValue ? `₹${emiValue.toLocaleString('en-IN')}/mo` : 'Check EMI'}
              </span>
            </div>
            <button
              className="truck-emi-cta"
              onClick={(e) => {
                e.stopPropagation()
                handleViewDetails()
              }}
            >
              View Plan
            </button>
          </div>

          {/* Location */}
          <div className="truck-card-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Location: {truck.location}</span>
          </div>

          {/* Footer */}
          <div className="truck-card-footer-apple">
            <div className="truck-card-price-apple">{truck.price}</div>
            <div className="truck-card-cta-group">
              <button 
                className="truck-card-cta-apple" 
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewDetails()
                }}
              >
                View Details →
              </button>
              <button 
                className="truck-card-cta-secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewDetails()
                }}
              >
                Book Test Drive
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
