'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [navbarPadding, setNavbarPadding] = useState('0.8rem 0')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLFormElement>(null)

  // Ensure component is mounted on client before using browser APIs
  useEffect(() => {
    setMounted(true)
  }, [])

const SHOW_SELL_LOCATION_LINKS = false

const searchSuggestions = [
    'Heavy Duty Trucks',
    'Medium Duty Trucks',
    'Light Duty Trucks',
    'Trailers',
    'Certified Trucks',
    'Truck Financing',
    'Truck Insurance',
    'Get Valuation',
    'Sell My Truck',
    'Fleet Services',
  ]

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || typeof document === 'undefined') return
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollY = window.pageYOffset

      sections.forEach(section => {
        const sectionHeight = section.clientHeight
        const sectionTop = (section as HTMLElement).offsetTop - 100
        const sectionId = section.getAttribute('id')
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          if (sectionId) {
            setActiveSection(sectionId)
          }
        }
      })

      // Navbar scroll effect
      if (window.scrollY > 50) {
        setNavbarPadding('0.5rem 0')
      } else {
        setNavbarPadding('0.8rem 0')
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    
    // Cleanup: reset body overflow when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [mounted])

  // Cleanup menu state on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    closeMenu()
    
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => {
      const newState = !prev
      // Prevent body scroll when menu is open
      if (typeof document !== 'undefined') {
        if (newState) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = ''
        }
      }
      return newState
    })
    setOpenDropdown(null)
  }

  const handleLinkClick = () => {
    // Close menu when any link is clicked
    closeMenu()
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const handleMouseEnter = (dropdown: string) => {
    if (mounted && typeof window !== 'undefined' && window.innerWidth > 768) {
      setOpenDropdown(dropdown)
    }
  }

  const handleMouseLeave = () => {
    if (mounted && typeof window !== 'undefined' && window.innerWidth > 768) {
      setOpenDropdown(null)
    }
  }

  const handleDropdownClick = (e: React.MouseEvent<HTMLAnchorElement>, dropdown: string) => {
    // On desktop, let the link work normally (navigation handled by href)
    // Dropdown is handled by hover on desktop
  }

  // Close dropdown when clicking outside on mobile
  useEffect(() => {
    if (!mounted) return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        const target = event.target as HTMLElement
        if (!target.closest('.dropdown')) {
          setOpenDropdown(null)
        }
      }
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen, mounted])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSuggestions(true)
    
    // If on browse-trucks page, update URL with search query
    if (pathname === '/browse-trucks' && mounted && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (query.trim()) {
        url.searchParams.set('search', query.trim())
      } else {
        url.searchParams.delete('search')
      }
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (pathname !== '/browse-trucks') {
        router.push(`/browse-trucks?search=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    if (pathname !== '/browse-trucks') {
      router.push(`/browse-trucks?search=${encodeURIComponent(suggestion)}`)
    } else if (mounted && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('search', suggestion)
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }

  // Sync search query with URL when on browse-trucks page
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    
    if (pathname === '/browse-trucks') {
      const urlParams = new URLSearchParams(window.location.search)
      const searchParam = urlParams.get('search')
      if (searchParam !== null) {
        setSearchQuery(searchParam)
      } else {
        // Clear search if URL param is removed
        setSearchQuery('')
      }
    }
  }, [pathname, mounted])

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="nav-backdrop"
          onClick={closeMenu}
          onTouchStart={closeMenu}
          aria-hidden="true"
        />
      )}
      
      <nav className="navbar" style={{ padding: navbarPadding }}>
        <div className="nav-container">
          <Link href="/" className="nav-logo" aria-label="Axlerator home" onClick={handleLinkClick}>
            <Image src="/logo.png" alt="Axlerator Logo" width={180} height={45} priority />
          </Link>
          
          {/* Search Bar */}
          <form className="nav-search" ref={searchRef} onSubmit={handleSearchSubmit} role="search">
          <input
            type="text"
            placeholder="Search trucks, services..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
            aria-label="Search trucks, services"
          />
          <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          
          {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
            <ul className="search-suggestions">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="search-suggestion-item"
                >
                  <svg className="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </form>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} aria-label="Primary" suppressHydrationWarning>
          {/* Buy Trucks - with dropdown */}
          <li 
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter('buy-trucks')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="dropdown-link-wrapper">
              <a 
                href="/browse-trucks" 
                className={`nav-link ${activeSection === 'buy-trucks' ? 'active' : ''} ${openDropdown === 'buy-trucks' ? 'dropdown-open' : ''}`}
                onClick={(e) => {
                  // On mobile, if dropdown is open, navigate and close menu
                  if (mounted && typeof window !== 'undefined' && window.innerWidth <= 768) {
                    if (openDropdown === 'buy-trucks') {
                      // If dropdown is open, navigate and close menu
                      closeMenu()
                      // Let the href handle navigation
                    } else {
                      // If dropdown is closed, navigate normally
                      closeMenu()
                    }
                  } else {
                    // Desktop: navigate normally
                    // Let the href handle navigation
                  }
                }}
              >
                Buy Trucks
              </a>
              <button
                type="button"
                className="dropdown-arrow-btn"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleDropdown('buy-trucks')
                }}
                aria-label="Toggle dropdown menu"
                aria-expanded={openDropdown === 'buy-trucks'}
              >
                <span className="dropdown-arrow">▼</span>
              </button>
            </div>
            <div className={`dropdown-menu dropdown-two-column ${openDropdown === 'buy-trucks' ? 'show' : ''}`}>
              <ul className="dropdown-column">
                <li><a href="/browse-trucks" className="dropdown-highlight" onClick={handleLinkClick}>View all trucks <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=mumbai" onClick={handleLinkClick}>Used trucks in Mumbai <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=delhi" onClick={handleLinkClick}>Used trucks in Delhi <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=delhi-ncr" onClick={handleLinkClick}>Used trucks in Delhi NCR <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=gurugram" onClick={handleLinkClick}>Used trucks in Gurugram <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=kanpur" onClick={handleLinkClick}>Used trucks in Kanpur <span className="dropdown-arrow-icon">→</span></a></li>
              </ul>
              <ul className="dropdown-column">
                <li><a href="/browse-trucks?location=lucknow" onClick={handleLinkClick}>Used trucks in Lucknow <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=chandigarh" onClick={handleLinkClick}>Used trucks in Chandigarh <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=pune" onClick={handleLinkClick}>Used trucks in Pune <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=kolkata" onClick={handleLinkClick}>Used trucks in Kolkata <span className="dropdown-arrow-icon">→</span></a></li>
                <li><a href="/browse-trucks?location=ahmedabad" onClick={handleLinkClick}>Used trucks in Ahmedabad <span className="dropdown-arrow-icon">→</span></a></li>
              </ul>
            </div>
          </li>

          {/* Sell Your Truck - with dropdown */}
          <li 
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter('sell-truck')}
            onMouseLeave={handleMouseLeave}
          >
            <a 
              href="/sell-truck" 
              className={`nav-link ${activeSection === 'sell-truck' ? 'active' : ''} ${openDropdown === 'sell-truck' ? 'dropdown-open' : ''}`}
              onClick={(e) => {
                // On mobile, always navigate directly and close menu
                if (mounted && typeof window !== 'undefined' && window.innerWidth <= 768) {
                  closeMenu()
                  // Let the href handle navigation - don't prevent default
                } else {
                  // Desktop: use dropdown behavior only if dropdown exists
                  if (SHOW_SELL_LOCATION_LINKS) {
                    handleDropdownClick(e, 'sell-truck')
                  }
                  // If no dropdown, let href handle navigation
                }
              }}
            >
              Sell Your Truck
              {SHOW_SELL_LOCATION_LINKS && <span className="dropdown-arrow">▼</span>}
            </a>
            {SHOW_SELL_LOCATION_LINKS && (
              <div className={`dropdown-menu dropdown-two-column ${openDropdown === 'sell-truck' ? 'show' : ''}`}>
                <ul className="dropdown-column">
                  <li><a href="/sell-truck" className="dropdown-highlight" onClick={handleLinkClick}>View all locations <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=mumbai" onClick={handleLinkClick}>Sell truck in Mumbai <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=delhi" onClick={handleLinkClick}>Sell truck in Delhi <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=delhi-ncr" onClick={handleLinkClick}>Sell truck in Delhi NCR <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=gurugram" onClick={handleLinkClick}>Sell truck in Gurugram <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=kanpur" onClick={handleLinkClick}>Sell truck in Kanpur <span className="dropdown-arrow-icon">→</span></a></li>
                </ul>
                <ul className="dropdown-column">
                  <li><a href="/sell-truck?location=lucknow" onClick={handleLinkClick}>Sell truck in Lucknow <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=chandigarh" onClick={handleLinkClick}>Sell truck in Chandigarh <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=pune" onClick={handleLinkClick}>Sell truck in Pune <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=kolkata" onClick={handleLinkClick}>Sell truck in Kolkata <span className="dropdown-arrow-icon">→</span></a></li>
                  <li><a href="/sell-truck?location=ahmedabad" onClick={handleLinkClick}>Sell truck in Ahmedabad <span className="dropdown-arrow-icon">→</span></a></li>
                </ul>
              </div>
            )}
          </li>

          {/* Our Services - simple link */}
          <li className="nav-item">
            <a 
              href="/services" 
              className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Our Services
            </a>
          </li>

          {/* Get Started - CTA button */}
          <li className="nav-item">
            <a 
              href="/sell-truck" 
              className="nav-link contact-btn"
              onClick={handleLinkClick}
            >
              Get Started
            </a>
          </li>
        </ul>
        <button
          type="button"
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            // Force close if open, force open if closed
            if (isMenuOpen) {
              setIsMenuOpen(false)
              setOpenDropdown(null)
              if (typeof document !== 'undefined') {
                document.body.style.overflow = ''
              }
            } else {
              setIsMenuOpen(true)
              if (typeof document !== 'undefined') {
                document.body.style.overflow = 'hidden'
              }
            }
          }}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          suppressHydrationWarning
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
    </>
  )
}
