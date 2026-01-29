'use client'

import { useState, useEffect, useCallback } from 'react'
import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

// Inspection Categories with detailed data
const inspectionData = {
  coreSystems: {
    score: 9.7,
    label: 'Core Systems',
    parts: 278,
    assemblies: 3,
    status: 'Excellent',
    items: [
      { name: 'Engine', status: 'Flawless, no imperfections', passed: true },
      { name: 'Transmission', status: 'Minor wear, fully functional', passed: true },
      { name: 'Drivetrain', status: 'Excellent condition', passed: true },
    ]
  },
  loadingSystems: {
    score: 9.5,
    label: 'Loading Systems',
    parts: 156,
    assemblies: 2,
    status: 'Excellent',
    items: [
      { name: 'Hydraulics', status: 'Fully operational', passed: true },
      { name: 'Cargo Bed', status: 'No structural damage', passed: true },
      { name: 'Tipping Mechanism', status: 'Smooth operation', passed: true },
    ]
  },
  cabinInteriors: {
    score: 8.8,
    label: 'Cabin & Interiors',
    parts: 124,
    assemblies: 4,
    status: 'Very Good',
    items: [
      { name: 'Seats & Upholstery', status: 'Minor wear, good condition', passed: true },
      { name: 'Dashboard & Controls', status: 'All functional', passed: true },
      { name: 'AC System', status: 'Optimal cooling', passed: true },
    ]
  },
  exteriorBody: {
    score: 9.2,
    label: 'Exterior & Body',
    parts: 89,
    assemblies: 2,
    status: 'Excellent',
    items: [
      { name: 'Body Panels', status: 'No major dents or rust', passed: true },
      { name: 'Paint & Finish', status: 'Good shine, minor scratches', passed: true },
      { name: 'Lights & Mirrors', status: 'All working', passed: true },
    ]
  },
  safetyBrakes: {
    score: 9.8,
    label: 'Safety & Brakes',
    parts: 67,
    assemblies: 2,
    status: 'Excellent',
    items: [
      { name: 'Brake System', status: 'Excellent stopping power', passed: true },
      { name: 'ABS Module', status: 'Fully functional', passed: true },
      { name: 'Safety Features', status: 'All systems operational', passed: true },
    ]
  },
}

// Truck Highlights
const truckHighlights = [
  { icon: 'power', label: 'Power Steering', desc: 'Easy maneuvering' },
  { icon: 'ac', label: 'Air Conditioned', desc: 'Climate control cabin' },
  { icon: 'brake', label: 'Air Brakes', desc: 'Superior stopping' },
  { icon: 'fuel', label: 'Fuel Efficient', desc: 'Optimized consumption' },
]

// Axlerator Advantages
const axleratorAdvantages = [
  { title: 'Axlerator Shield', subtitle: '12-month warranty', color: '#dc2626' },
  { title: '200+ Point Check', subtitle: 'Certified quality', color: '#059669' },
  { title: 'Service Pack', subtitle: '2 free services', color: '#2563eb' },
  { title: 'RC Transfer', subtitle: 'Hassle-free', color: '#7c3aed' },
  { title: 'Flexi Finance', subtitle: 'Easy EMI', color: '#ea580c' },
  { title: 'Breakdown Support', subtitle: 'Pan-India', color: '#0891b2' },
]

// Truck-specific features
const truckCapabilities = [
  { name: 'Power Steering', available: true },
  { name: 'Air Brake System', available: true },
  { name: 'Sleeper Cabin', available: true },
  { name: 'Turbo Intercooler', available: true },
  { name: 'Multi-Speed Gearbox', available: true },
  { name: 'Tachograph', available: true },
  { name: 'Roof-Mounted AC', available: true },
  { name: 'Air Suspension', available: false },
  { name: 'Telematics Ready', available: true },
  { name: 'Retarder System', available: false },
  { name: 'Hill Start Assist', available: true },
  { name: 'LED Headlamps', available: true },
]

export default function TruckDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [truck, setTruck] = useState<any>(null)
  const [similarTrucks, setSimilarTrucks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('specs')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [truckImages, setTruckImages] = useState<string[]>([])
  const [visibleThumbStart, setVisibleThumbStart] = useState(0)
  const visibleThumbCount = 10 // Show 10 thumbnails at a time
  const [showContactForm, setShowContactForm] = useState(false)
  const [showTestDriveForm, setShowTestDriveForm] = useState(false)
  const [showFullReport, setShowFullReport] = useState(false)
  const [showReportOTPModal, setShowReportOTPModal] = useState(false)
  const [reportPhone, setReportPhone] = useState('')
  const [reportOTP, setReportOTP] = useState('')
  const [reportOTPStep, setReportOTPStep] = useState<'phone' | 'otp'>('phone')
  const [reportOTPLoading, setReportOTPLoading] = useState(false)
  const [reportOTPError, setReportOTPError] = useState('')
  const [hasVerifiedReportOTP, setHasVerifiedReportOTP] = useState(false)
  const [activeReportTab, setActiveReportTab] = useState('coreSystems')
  const [expandedItems, setExpandedItems] = useState<string[]>(['coreSystems'])
  const [isVisible, setIsVisible] = useState(false)
  
  // Finance Calculator
  const [financeAmount, setFinanceAmount] = useState(3000000)
  const [initialPayment, setInitialPayment] = useState(0)
  const [loanPeriod, setLoanPeriod] = useState(60)
  const [monthlyEMI, setMonthlyEMI] = useState(0)
  const [interestAmount, setInterestAmount] = useState(0)
  const rateOfInterest = 10.5

  const loadTruckData = useCallback(async () => {
    try {
      const res = await fetch(`/api/trucks/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        if (data && !data.error) {
          setTruck(data)
          
          // Load all images for this truck
          try {
            const imagesRes = await fetch(`/api/trucks/${params.id}/images`)
            if (imagesRes.ok) {
              const imagesData = await imagesRes.json()
              if (imagesData.images && imagesData.images.length > 0) {
                // Remove duplicate URLs
                const uniqueImages = Array.from(new Set(imagesData.images.filter((url: string) => url)))
                console.log(`Loaded ${uniqueImages.length} unique images for truck ${params.id} (from ${imagesData.images.length} total)`)
                setTruckImages(uniqueImages.length > 0 ? uniqueImages : (data.imageUrl ? [data.imageUrl] : []))
              } else {
                // Fallback to single image
                setTruckImages(data.imageUrl ? [data.imageUrl] : [])
              }
            } else {
              // Fallback to single image
              setTruckImages(data.imageUrl ? [data.imageUrl] : [])
            }
          } catch (imgErr) {
            console.error('Error loading truck images:', imgErr)
            // Fallback to single image
            setTruckImages(data.imageUrl ? [data.imageUrl] : [])
          }
        } else {
          // Show error message instead of dummy data
          console.error('Truck not found or error in response:', data)
          setTruck(null)
          setTruckImages([])
        }
      } else {
        // Handle API error
        const errorData = await res.json().catch(() => ({}))
        console.error('Failed to load truck:', errorData.error || 'Unknown error')
        setTruck(null)
        setTruckImages([])
      }
    } catch (err) {
      console.error('Error loading truck:', err)
      setTruck(null)
      setTruckImages([])
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const loadSimilarTrucks = useCallback(async () => {
    try {
      const res = await fetch(`/api/trucks/${params.id}/similar`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setSimilarTrucks(data)
      }
    } catch (err) {
      console.error('Error loading similar trucks:', err)
      setSimilarTrucks([])
    }
  }, [params.id])

  const computeEMI = useCallback(() => {
    const principal = financeAmount - initialPayment
    const monthlyRate = rateOfInterest / 12 / 100
    const months = loanPeriod

    if (principal <= 0) {
      setMonthlyEMI(0)
      setInterestAmount(0)
      return
    }

    const emiCalc = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    setMonthlyEMI(emiCalc)
    setInterestAmount((emiCalc * months) - principal)
  }, [financeAmount, initialPayment, loanPeriod])

  useEffect(() => {
    loadTruckData()
    setIsVisible(true)
  }, [loadTruckData])

  useEffect(() => {
    if (truck) {
      setFinanceAmount(parseFloat(truck.price))
      loadSimilarTrucks()
    }
  }, [truck, loadSimilarTrucks])

  useEffect(() => {
    computeEMI()
  }, [computeEMI])

  // Keep selected thumbnail visible when it changes
  useEffect(() => {
    // Use truckImages if available, otherwise fallback to gallery from getGalleryImages
    const totalImages = truckImages.length > 0 ? truckImages.length : (truck?.imageUrl ? 1 : 0)
    if (totalImages > visibleThumbCount) {
      // If selected image is before visible range, scroll to show it
      if (selectedImageIndex < visibleThumbStart) {
        setVisibleThumbStart(selectedImageIndex)
      }
      // If selected image is after visible range, scroll to show it
      else if (selectedImageIndex >= visibleThumbStart + visibleThumbCount) {
        setVisibleThumbStart(Math.max(0, selectedImageIndex - visibleThumbCount + 1))
      }
    }
  }, [selectedImageIndex, truckImages.length, visibleThumbCount, visibleThumbStart, truck?.imageUrl])

  const displayPrice = (price: string | number | undefined | null) => {
    if (price === undefined || price === null) return '₹0'
    const num = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(num)) return '₹0'
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`
    return `₹${num.toLocaleString('en-IN')}`
  }

  const shortPrice = (price: string | number | undefined | null) => {
    if (price === undefined || price === null) return '0'
    const num = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(num)) return '0'
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`
    return num.toLocaleString('en-IN')
  }

  const getGalleryImages = () => {
    // Use dynamically loaded images if available
    if (truckImages.length > 0) {
      return truckImages
    }
    
    if (!truck?.imageUrl) return []
    
    // Special handling for Eicher PRO 2110 - use all 4 images
    if (truck.manufacturer === 'Eicher Motors' && truck.model?.includes('PRO 2110')) {
      return [
        '/trucks/eicher-truck-1.webp',
        '/trucks/eicher-truck-2.webp',
        '/trucks/eicher-truck-3.webp',
        '/trucks/eicher-truck-4.webp'
      ]
    }
    
    // Special handling for Truck 3 (Eicher 1059 Xp) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Eicher Motors' && truck.model === '1059 Xp') {
      return [
        '/trucks/truck3-image-2.png',
        '/trucks/truck3-image-3.png',
        '/trucks/truck3-image-4.png',
        '/trucks/truck3-image-5.png'
      ]
    }
    
    // Special handling for Truck 4 (Tata 1512 LPT) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === '1512 LPT') {
      return [
        '/trucks/truck4-image-1.png',
        '/trucks/truck4-image-3.jpeg',
        '/trucks/truck4-image-4.jpeg'
      ]
    }
    
    // Special handling for Truck 5 (Eicher Pro 3015) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Eicher Motors' && truck.model === 'Pro 3015') {
      return [
        '/trucks/truck5-image-2.png',
        '/trucks/truck5-image-3.png',
        '/trucks/truck5-image-4.png',
        '/trucks/truck5-image-5.png',
        '/trucks/truck5-image-6.png',
        '/trucks/truck5-image-7.png'
      ]
    }
    
    // Special handling for Truck 6 (Eicher Pro 3019) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Eicher Motors' && truck.model === 'Pro 3019') {
      return [
        '/trucks/truck6-image-2.jpg',
        '/trucks/truck6-image-3.jpg',
        '/trucks/truck6-image-4.jpg',
        '/trucks/truck6-image-5.jpg'
      ]
    }
    
    // Special handling for Truck 7 (Tata 3518) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === '3518') {
      return [
        '/trucks/truck7-image-2.png',
        '/trucks/truck7-image-3.png',
        '/trucks/truck7-image-4.png',
        '/trucks/truck7-image-5.png'
      ]
    }
    
    // Special handling for Truck 8 (Eicher PRO 2110 - second one) - use all 5 images
    if (truck.imageUrl?.includes('truck8-image-1.png')) {
      return [
        '/trucks/truck8-image-1.png',
        '/trucks/truck8-image-2.png',
        '/trucks/truck8-image-3.png',
        '/trucks/truck8-image-4.png',
        '/trucks/truck8-image-5.png'
      ]
    }
    
    // Special handling for Truck 9 (Tata Truck) - use only truck photos (excluding info screenshot)
    if (truck.imageUrl?.includes('truck9-image-1.png')) {
      return [
        '/trucks/truck9-image-1.png',
        '/trucks/truck9-image-2.png',
        '/trucks/truck9-image-3.png',
        '/trucks/truck9-image-4.png',
        '/trucks/truck9-image-5.png'
      ]
    }
    
    // Special handling for Truck 10 (Tata LPT-1109-HEX2) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === 'LPT-1109-HEX2') {
      return [
        '/trucks/truck10-image-1.jpg',
        '/trucks/truck10-image-2.jpg',
        '/trucks/truck10-image-3.jpg'
      ]
    }
    
    // Special handling for Truck 11 (Eicher Truck) - use only truck photos (excluding info screenshot)
    if (truck.imageUrl?.includes('truck11-image-1.png')) {
      return [
        '/trucks/truck11-image-1.png',
        '/trucks/truck11-image-2.png',
        '/trucks/truck11-image-3.png'
      ]
    }
    
    // Special handling for Truck 12 (Tata LPT-3118) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === 'LPT-3118') {
      return [
        '/trucks/truck12-image-1.png',
        '/trucks/truck12-image-2.png',
        '/trucks/truck12-image-3.png',
        '/trucks/truck12-image-4.png'
      ]
    }
    
    // Special handling for Truck 13 (Eicher Truck) - use only truck photos (excluding info screenshot)
    if (truck.imageUrl?.includes('truck13-image-1.png')) {
      return [
        '/trucks/truck13-image-1.png',
        '/trucks/truck13-image-2.png',
        '/trucks/truck13-image-3.png',
        '/trucks/truck13-image-4.png',
        '/trucks/truck13-image-5.png'
      ]
    }
    
    // Special handling for Truck 14 (Ashok Leyland Partner 1114) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Ashok Leyland' && truck.model === 'Partner 1114') {
      return [
        '/trucks/truck14-image-1.png',
        '/trucks/truck14-image-2.png',
        '/trucks/truck14-image-3.png',
        '/trucks/truck14-image-4.png',
        '/trucks/truck14-image-5.png'
      ]
    }
    
    // Special handling for Truck 15 (Ashok Leyland 1615) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Ashok Leyland' && truck.model === '1615') {
      return [
        '/trucks/truck15-image-1.png',
        '/trucks/truck15-image-2.png',
        '/trucks/truck15-image-3.png',
        '/trucks/truck15-image-4.png',
        '/trucks/truck15-image-5.png',
        '/trucks/truck15-image-6.png'
      ]
    }
    
    // Special handling for Truck 16 (Eicher PRO 2114 XP) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Eicher Motors' && truck.model === 'PRO 2114 XP') {
      return [
        '/trucks/truck16-image-1.png',
        '/trucks/truck16-image-2.png',
        '/trucks/truck16-image-3.png',
        '/trucks/truck16-image-4.png',
        '/trucks/truck16-image-5.png'
      ]
    }
    
    // Special handling for Truck 17 (Ashok Leyland Ecomet 1214) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Ashok Leyland' && truck.model === 'Ecomet 1214') {
      return [
        '/trucks/truck17-image-1.png',
        '/trucks/truck17-image-2.png',
        '/trucks/truck17-image-3.png',
        '/trucks/truck17-image-4.png'
      ]
    }
    
    // Special handling for Truck 18 (Eicher Pro 2059VD) - use all truck photos
    if (truck.manufacturer === 'Eicher Motors' && truck.model === 'Pro 2059VD') {
      return [
        '/trucks/truck18-image-1.png',
        '/trucks/truck18-image-2.png',
        '/trucks/truck18-image-3.png',
        '/trucks/truck18-image-4.png',
        '/trucks/truck18-image-5.png'
      ]
    }
    
    // Special handling for Truck 19 (Eicher Pro 2118) - use all truck photos
    if (truck.manufacturer === 'Eicher Motors' && truck.model === 'Pro 2118') {
      return [
        '/trucks/truck19-image-1.png',
        '/trucks/truck19-image-2.png',
        '/trucks/truck19-image-3.png',
        '/trucks/truck19-image-4.png',
        '/trucks/truck19-image-5.png',
        '/trucks/truck19-image-6.png',
        '/trucks/truck19-image-7.png',
        '/trucks/truck19-image-8.png'
      ]
    }
    
    // Special handling for Truck 20 (Tata 1613 CRi6) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === '1613 CRi6') {
      return [
        '/trucks/truck20-image-1.png',
        '/trucks/truck20-image-2.png',
        '/trucks/truck20-image-3.png',
        '/trucks/truck20-image-4.png'
      ]
    }
    
    // Special handling for Truck 21 (Eicher Pro 2059XP) - use all truck photos
    if (truck.manufacturer === 'Eicher Motors' && truck.model === 'Pro 2059XP') {
      return [
        '/trucks/truck21-image-1.png',
        '/trucks/truck21-image-2.png',
        '/trucks/truck21-image-3.png',
        '/trucks/truck21-image-4.png',
        '/trucks/truck21-image-5.png'
      ]
    }
    
    // Special handling for Truck 22 (Tata Truck) - use all truck photos
    if (truck.imageUrl?.includes('truck22-image-1.png')) {
      return [
        '/trucks/truck22-image-1.png',
        '/trucks/truck22-image-2.png',
        '/trucks/truck22-image-3.png',
        '/trucks/truck22-image-4.png'
      ]
    }
    
    // Special handling for Truck 23 (Ashok Leyland Pick-up) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Ashok Leyland' && truck.model === 'Pick-up') {
      return [
        '/trucks/truck23-image-1.png',
        '/trucks/truck23-image-2.png',
        '/trucks/truck23-image-3.png',
        '/trucks/truck23-image-4.png',
        '/trucks/truck23-image-5.png',
        '/trucks/truck23-image-6.png'
      ]
    }
    
    // Special handling for Truck 24 (Eicher Truck) - use only truck photos (excluding info screenshot)
    if (truck.imageUrl?.includes('truck24-image-1.png')) {
      return [
        '/trucks/truck24-image-1.png',
        '/trucks/truck24-image-2.png',
        '/trucks/truck24-image-3.png',
        '/trucks/truck24-image-4.png',
        '/trucks/truck24-image-5.png',
        '/trucks/truck24-image-6.png'
      ]
    }
    
    // Special handling for Truck 25 (SML Isuzu Truck) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'SML Isuzu' && truck.model === 'Truck') {
      return [
        '/trucks/truck25-image-1.png',
        '/trucks/truck25-image-2.png',
        '/trucks/truck25-image-3.png',
        '/trucks/truck25-image-4.png',
        '/trucks/truck25-image-5.png'
      ]
    }
    
    // Special handling for Truck 26 (Eicher 2059) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Eicher Motors' && truck.model === '2059' && truck.year === 2021 && truck.kilometers === 52000) {
      return [
        '/trucks/truck26-image-1.png',
        '/trucks/truck26-image-2.png',
        '/trucks/truck26-image-3.png',
        '/trucks/truck26-image-4.png'
      ]
    }
    
    // Special handling for Truck 27 (Eicher 2059 xp) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Eicher Motors' && truck.model === '2059 xp' && truck.year === 2022 && truck.kilometers === 72000) {
      return [
        '/trucks/truck27-image-1.png',
        '/trucks/truck27-image-2.png',
        '/trucks/truck27-image-3.png',
        '/trucks/truck27-image-4.png'
      ]
    }
    
    // Special handling for Truck 28 (Tata 709 LPT) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === '709 LPT' && truck.year === 2021 && truck.kilometers === 87000) {
      return [
        '/trucks/truck28-image-1.png',
        '/trucks/truck28-image-2.png',
        '/trucks/truck28-image-3.png'
      ]
    }
    
    // Special handling for Truck 29 (Tata 709 G LPT) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === '709 G LPT' && truck.year === 2022 && truck.kilometers === 83900) {
      return [
        '/trucks/truck29-image-1.png',
        '/trucks/truck29-image-2.png',
        '/trucks/truck29-image-3.png',
        '/trucks/truck29-image-4.png'
      ]
    }
    
    // Special handling for Truck 30 (Tata 1109 G LPT) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === '1109 G LPT' && truck.year === 2020 && truck.kilometers === 87000) {
      return [
        '/trucks/truck30-image-1.png',
        '/trucks/truck30-image-2.png',
        '/trucks/truck30-image-3.png'
      ]
    }
    
    // Special handling for Truck 31 (Tata 1512 LPT) - use only truck photos (excluding info screenshot)
    if (truck.manufacturer === 'Tata Motors' && truck.model === '1512 LPT' && truck.year === 2022 && truck.kilometers === 73000) {
      return [
        '/trucks/truck31-image-1.png',
        '/trucks/truck31-image-2.png',
        '/trucks/truck31-image-3.png',
        '/trucks/truck31-image-4.png',
        '/trucks/truck31-image-5.png',
        '/trucks/truck31-image-6.png'
      ]
    }
    
    // Default: repeat the main image
    return [truck.imageUrl, truck.imageUrl, truck.imageUrl, truck.imageUrl]
  }

  const listPrice = truck ? parseFloat(truck.price) * 1.08 : 0
  const savings = truck ? Math.round(parseFloat(truck.price) * 0.08) : 0

  const toggleExpandItem = (key: string) => {
    setExpandedItems(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }


  const getScoreColor = (score: number) => {
    if (score >= 9) return '#059669'
    if (score >= 8) return '#2563eb'
    if (score >= 7) return '#d97706'
    return '#dc2626'
  }

  const handleViewFullReportClick = () => {
    if (hasVerifiedReportOTP) {
      setShowFullReport(true)
      return
    }
    setReportOTPError('')
    setReportOTPStep('phone')
    setShowReportOTPModal(true)
  }

  const handleSendReportOTP = async () => {
    if (!reportPhone || reportPhone.trim().length < 10) {
      setReportOTPError('Please enter a valid phone number')
      return
    }

    try {
      setReportOTPLoading(true)
      setReportOTPError('')

      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: reportPhone.trim(),
          purpose: 'report_view',
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setReportOTPError(data?.error || 'Failed to send OTP. Please try again.')
        return
      }

      setReportOTPStep('otp')
    } catch (error) {
      console.error('Error sending report OTP:', error)
      setReportOTPError('Failed to send OTP. Please try again.')
    } finally {
      setReportOTPLoading(false)
    }
  }

  const handleVerifyReportOTP = async () => {
    if (!reportOTP || reportOTP.trim().length !== 6) {
      setReportOTPError('Please enter the 6-digit OTP sent to your phone')
      return
    }

    try {
      setReportOTPLoading(true)
      setReportOTPError('')

      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: reportPhone.trim(),
          otp: reportOTP.trim(),
          purpose: 'report_view',
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data?.verified) {
        setReportOTPError(data?.error || 'Invalid OTP. Please try again.')
        return
      }

      setHasVerifiedReportOTP(true)
      setShowReportOTPModal(false)
      setShowFullReport(true)
    } catch (error) {
      console.error('Error verifying report OTP:', error)
      setReportOTPError('Failed to verify OTP. Please try again.')
    } finally {
      setReportOTPLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="truck-details-page">
        <Navbar />
        <div className="td-loading">
          <div className="td-spinner"></div>
          <p>Loading truck details...</p>
        </div>
      </div>
    )
  }

  if (!truck) {
    return (
      <div className="truck-details-page">
        <Navbar />
        <div className="td-error">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <h2>Vehicle Not Available</h2>
          <p>This truck may have been sold or is no longer listed.</p>
          <button onClick={() => router.push('/browse-trucks')} className="td-cta-btn">
            Explore Available Trucks
          </button>
        </div>
      </div>
    )
  }

  const gallery = getGalleryImages()
  const overallScore = (Object.values(inspectionData).reduce((acc, cat) => acc + cat.score, 0) / Object.keys(inspectionData).length).toFixed(1)

  return (
    <div className={`truck-details-page ${isVisible ? 'page-visible' : ''}`}>
      <Navbar />
      
      {/* Breadcrumb */}
      <nav className="td-breadcrumb">
        <div className="td-breadcrumb-inner">
          <Link href="/">Home</Link>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <Link href="/browse-trucks">Trucks</Link>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <Link href={`/browse-trucks?brand=${truck.manufacturer}`}>{truck.manufacturer}</Link>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span>{truck.model}</span>
        </div>
      </nav>

      {/* Main Product Section */}
      <div className="td-product">
        {/* Gallery */}
        <div className="td-gallery">
          <div className="td-main-image">
            <Image
              src={gallery[selectedImageIndex] || '/placeholder.jpg'}
              alt={truck.name}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              unoptimized
              priority
            />
            <button 
              className="td-nav-btn prev"
              onClick={() => {
                const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : gallery.length - 1
                setSelectedImageIndex(newIndex)
                // Adjust visible thumbnails to keep selected image in view
                if (newIndex < visibleThumbStart) {
                  setVisibleThumbStart(newIndex)
                } else if (newIndex >= visibleThumbStart + visibleThumbCount) {
                  setVisibleThumbStart(Math.max(0, newIndex - visibleThumbCount + 1))
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button 
              className="td-nav-btn next"
              onClick={() => {
                const newIndex = selectedImageIndex < gallery.length - 1 ? selectedImageIndex + 1 : 0
                setSelectedImageIndex(newIndex)
                // Adjust visible thumbnails to keep selected image in view
                if (newIndex < visibleThumbStart) {
                  setVisibleThumbStart(newIndex)
                } else if (newIndex >= visibleThumbStart + visibleThumbCount) {
                  setVisibleThumbStart(Math.max(0, newIndex - visibleThumbCount + 1))
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <div className="td-certified-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Axlerator Assured
            </div>
          </div>
          
          {/* Image Dots - Moved below the image */}
          <div className="td-image-dots-container">
            {gallery.length > visibleThumbCount && (
              <div className="td-image-dots-wrapper">
                {gallery.slice(visibleThumbStart, visibleThumbStart + visibleThumbCount).map((_, relativeIdx) => {
                  const absoluteIdx = visibleThumbStart + relativeIdx
                  return (
                    <button 
                      key={absoluteIdx}
                      className={`td-dot ${absoluteIdx === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedImageIndex(absoluteIdx)
                        // Keep the dot in view if needed
                        if (absoluteIdx < visibleThumbStart) {
                          setVisibleThumbStart(absoluteIdx)
                        } else if (absoluteIdx >= visibleThumbStart + visibleThumbCount) {
                          setVisibleThumbStart(Math.max(0, absoluteIdx - visibleThumbCount + 1))
                        }
                      }}
                      aria-label={`Go to image ${absoluteIdx + 1}`}
                    />
                  )
                })}
              </div>
            )}
            {gallery.length <= visibleThumbCount && (
              <div className="td-image-dots-wrapper">
                {gallery.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`td-dot ${idx === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Thumbnails - Only show if there are images */}
          {gallery.length > 0 && (
            <div className="td-thumbs-container">
              {gallery.length > visibleThumbCount && (
                <button
                  className="td-thumbs-nav-btn td-thumbs-prev"
                  onClick={() => {
                    const newStart = Math.max(0, visibleThumbStart - 1)
                    setVisibleThumbStart(newStart)
                  }}
                  disabled={visibleThumbStart === 0}
                  aria-label="Scroll thumbnails left"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
              )}
              <div className="td-thumbs">
                {gallery.slice(visibleThumbStart, visibleThumbStart + visibleThumbCount).map((img, relativeIdx) => {
                  const absoluteIdx = visibleThumbStart + relativeIdx
                  // Only render if image exists
                  if (!img || img === '/placeholder.jpg') return null
                  return (
                    <button
                      key={absoluteIdx}
                      className={`td-thumb ${absoluteIdx === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(absoluteIdx)}
                    >
                      <Image src={img} alt={`Thumbnail ${absoluteIdx + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                    </button>
                  )
                })}
              </div>
              {gallery.length > visibleThumbCount && (
                <button
                  className="td-thumbs-nav-btn td-thumbs-next"
                  onClick={() => {
                    const maxStart = Math.max(0, gallery.length - visibleThumbCount)
                    const newStart = Math.min(maxStart, visibleThumbStart + 1)
                    setVisibleThumbStart(newStart)
                  }}
                  disabled={visibleThumbStart >= gallery.length - visibleThumbCount}
                  aria-label="Scroll thumbnails right"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="td-info">
          <div className="td-info-header">
            <div>
              <h1>{truck.year} {truck.name}</h1>
              <p className="td-subtitle">{truck.manufacturer} {truck.model} • {truck.horsepower} HP</p>
            </div>
            <button className="td-wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="td-quick-stats">
            <div className="td-stat">
              <span className="td-stat-value">{truck.kilometers?.toLocaleString() || '0'} km</span>
              <span className="td-stat-label">Odometer</span>
            </div>
            <div className="td-stat-divider"></div>
            <div className="td-stat">
              <span className="td-stat-value">Diesel</span>
              <span className="td-stat-label">Fuel Type</span>
            </div>
            <div className="td-stat-divider"></div>
            <div className="td-stat">
              <span className="td-stat-value">Manual</span>
              <span className="td-stat-label">Transmission</span>
            </div>
            <div className="td-stat-divider"></div>
            <div className="td-stat">
              <span className="td-stat-value">1st</span>
              <span className="td-stat-label">Owner</span>
            </div>
          </div>

          {/* Price Card */}
          <div className="td-price-card">
            <div className="td-price-top">
              <div className="td-price-main">
                <span className="td-price-current">{displayPrice(truck.price)}</span>
                <span className="td-price-original">{displayPrice(listPrice)}</span>
              </div>
              <span className="td-savings-badge">Save ₹{savings.toLocaleString()}</span>
            </div>
            <div className="td-emi-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <span>EMI from <strong>₹{Math.round(monthlyEMI).toLocaleString()}/mo</strong></span>
              <span className="td-rate">@ {rateOfInterest}%</span>
              <button 
                className="td-emi-calculator-btn"
                onClick={() => {
                  setActiveSection('finance')
                  setTimeout(() => {
                    const financeSection = document.querySelector('.td-tabs-section')
                    if (financeSection) {
                      financeSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }, 100)
                }}
              >
                Calculate EMI
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="td-cta-group">
            <button className="td-btn-primary" onClick={() => setShowContactForm(true)}>
              Get Best Price
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="td-btn-secondary" onClick={() => setShowTestDriveForm(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book a Test Drive
            </button>
          </div>

          {/* Trust Badges */}
          <div className="td-trust-row">
            <div className="td-trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>RC transfer included</span>
            </div>
          </div>

          {/* Location */}
          <div className="td-location">
            <div className="td-location-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div>
                <span className="td-loc-name">Axlerator Yard, Bhosari</span>
                <span className="td-loc-address">Industrial Area, Pune</span>
              </div>
            </div>
            <button className="td-directions">
              Get Directions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="td-tabs-section">
        <div className="td-tabs-nav">
          {[
            { id: 'specs', label: 'Specifications' },
            { id: 'inspection', label: 'Quality Report' },
            { id: 'features', label: 'Features' },
            { id: 'finance', label: 'EMI Calculator' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`td-tab ${activeSection === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="td-tabs-content">
          {/* Specifications */}
          {activeSection === 'specs' && (
            <div className="td-panel">
              <h2 className="td-panel-title">Vehicle Specifications</h2>
              <div className="td-specs-grid">
                {[
                  { label: 'Year', value: truck.year },
                  { label: 'Brand', value: truck.manufacturer },
                  { label: 'Model', value: truck.model },
                  { label: 'Fuel', value: 'Diesel (BS-VI)' },
                  { label: 'Odometer', value: `${truck.kilometers?.toLocaleString() || '0'} km` },
                  { label: 'Power', value: `${truck.horsepower} HP` },
                  { label: 'Gearbox', value: '6-Speed Manual' },
                  { label: 'RTO', value: 'MH-14 (Pune)' },
                  { label: 'Insurance', value: 'Valid till Dec 2025' },
                  { label: 'Ownership', value: 'First Owner' },
                ].map((spec, idx) => (
                  <div key={idx} className="td-spec-row">
                    <span className="td-spec-label">{spec.label}</span>
                    <span className="td-spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>

              <h3 className="td-subsection-title">Load Capacity</h3>
              <div className="td-load-cards">
                <div className="td-load-card">
                  <span className="td-load-value">16.2<small>T</small></span>
                  <span className="td-load-label">Gross Weight</span>
                </div>
                <div className="td-load-card highlight">
                  <span className="td-load-value">10<small>T</small></span>
                  <span className="td-load-label">Payload</span>
                </div>
                <div className="td-load-card">
                  <span className="td-load-value">20<small>ft</small></span>
                  <span className="td-load-label">Body Length</span>
                </div>
              </div>
            </div>
          )}

          {/* Quality Report / Inspection */}
          {activeSection === 'inspection' && (
            <div className="td-panel td-report-panel">
              {/* Report Header */}
              <div className="td-report-header">
                <div className="td-report-header-left">
                  <h2 className="td-panel-title">Truck Quality Report</h2>
                  <p className="td-report-subtitle">200+ checkpoints evaluated by certified mechanics</p>
                </div>
                <div className="td-report-score-main">
                  <div className="td-score-circle" style={{ '--score-color': getScoreColor(parseFloat(overallScore)) } as React.CSSProperties}>
                    <span className="td-score-num">{overallScore}</span>
                    <span className="td-score-label">Overall</span>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="td-highlights">
                <h4 className="td-highlights-label">HIGHLIGHTS</h4>
                <div className="td-highlights-grid">
                  {truckHighlights.map((h, idx) => (
                    <div key={idx} className="td-highlight-item">
                      <div className="td-highlight-icon">
                        {h.icon === 'power' && (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                          </svg>
                        )}
                        {h.icon === 'ac' && (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2v10M12 12l8 4M12 12L4 16M12 12v10"/>
                            <path d="M17 7l-5 5-5-5"/>
                          </svg>
                        )}
                        {h.icon === 'brake' && (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="4"/>
                            <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
                          </svg>
                        )}
                        {h.icon === 'fuel' && (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>
                            <path d="M3 10h12M7 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
                            <path d="M15 6h2a2 2 0 0 1 2 2v4l2 2v6h-2"/>
                          </svg>
                        )}
                      </div>
                      <div className="td-highlight-text">
                        <span className="td-highlight-name">{h.label}</span>
                        <span className="td-highlight-desc">{h.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Tabs */}
              <div className="td-score-tabs">
                {Object.entries(inspectionData).map(([key, data]) => (
                  <button
                    key={key}
                    className={`td-score-tab ${activeReportTab === key ? 'active' : ''}`}
                    onClick={() => setActiveReportTab(key)}
                  >
                    <span className="td-score-tab-label">{data.label}</span>
                    <span 
                      className="td-score-tab-badge" 
                      style={{ background: getScoreColor(data.score) }}
                    >
                      {data.score}
                    </span>
                  </button>
                ))}
              </div>

              {/* How Scores Work */}
              <button className="td-scores-info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>See how scores are calculated</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              {/* Category Details */}
              <div className="td-category-details">
                {Object.entries(inspectionData).map(([key, data]) => (
                  <div 
                    key={key} 
                    className={`td-category-card ${expandedItems.includes(key) ? 'expanded' : ''} ${activeReportTab === key ? 'active' : ''}`}
                  >
                    <button 
                      className="td-category-header"
                      onClick={() => toggleExpandItem(key)}
                    >
                      <div className="td-category-left">
                        <div className="td-category-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M3 9h18M9 21V9"/>
                          </svg>
                        </div>
                        <div className="td-category-info">
                          <span className="td-category-name">{data.label}</span>
                          <span className="td-category-parts">{data.parts} parts across {data.assemblies} assemblies</span>
                        </div>
                      </div>
                      <div className="td-category-right">
                        <div className="td-category-score" style={{ background: getScoreColor(data.score) }}>
                          <span>{data.score}</span>
                          <small>{data.status}</small>
                        </div>
                        <svg className="td-expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                    </button>
                    
                    {expandedItems.includes(key) && (
                      <div className="td-category-items">
                        {data.items.map((item, idx) => (
                          <div key={idx} className="td-category-item">
                            <div className="td-item-left">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5"/>
                              </svg>
                              <div>
                                <span className="td-item-name">{item.name}</span>
                                <span className="td-item-status">{item.status}</span>
                              </div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                              <path d="M9 18l6-6-6-6"/>
                            </svg>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* View Full Report Button */}
              <button className="td-view-report-btn" onClick={handleViewFullReportClick}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                View Full Quality Report
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

          {/* Features */}
          {activeSection === 'features' && (
            <div className="td-panel">
              <h2 className="td-panel-title">Equipment & Features</h2>
              <div className="td-features-grid">
                {truckCapabilities.map((cap, idx) => (
                  <div key={idx} className={`td-feature-item ${cap.available ? 'available' : 'unavailable'}`}>
                    {cap.available ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                    <span>{cap.name}</span>
                  </div>
                ))}
              </div>

              <div className="td-fleet-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <div className="td-fleet-content">
                  <h3>Fleet Ready Certification</h3>
                  <p>Ready for immediate deployment with all compliance certificates in place.</p>
                </div>
              </div>

              <div className="td-compliance-list">
                {['Fitness Certificate Valid', 'PUC Valid', 'GPS Enabled', 'National Permit Ready'].map((item, idx) => (
                  <span key={idx} className="td-compliance-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Finance Calculator */}
          {activeSection === 'finance' && (
            <div className="td-panel">
              <h2 className="td-panel-title">EMI Calculator</h2>
              <div className="td-finance-grid">
                <div className="td-calc-section">
                  <div className="td-slider-block">
                    <div className="td-slider-top">
                      <label>Loan Amount</label>
                      <span className="td-slider-value">₹{financeAmount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="100000"
                      max={parseFloat(truck.price)}
                      step="50000"
                      value={financeAmount}
                      onChange={(e) => setFinanceAmount(parseInt(e.target.value))}
                      className="td-slider"
                    />
                    <div className="td-slider-ends">
                      <span>₹1L</span>
                      <span>₹{shortPrice(truck.price)}</span>
                    </div>
                  </div>

                  <div className="td-slider-block">
                    <div className="td-slider-top">
                      <label>Down Payment</label>
                      <span className="td-slider-value">₹{initialPayment.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={financeAmount * 0.5}
                      step="25000"
                      value={initialPayment}
                      onChange={(e) => setInitialPayment(parseInt(e.target.value))}
                      className="td-slider"
                    />
                    <div className="td-slider-ends">
                      <span>₹0</span>
                      <span>₹{(financeAmount * 0.5).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="td-slider-block">
                    <div className="td-slider-top">
                      <label>Tenure</label>
                      <span className="td-slider-value">{loanPeriod} Months</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="84"
                      step="12"
                      value={loanPeriod}
                      onChange={(e) => setLoanPeriod(parseInt(e.target.value))}
                      className="td-slider"
                    />
                    <div className="td-slider-ends">
                      <span>12 mo</span>
                      <span>84 mo</span>
                    </div>
                  </div>
                </div>

                <div className="td-emi-result">
                  <div className="td-emi-main-result">
                    <span className="td-emi-title">Monthly EMI</span>
                    <span className="td-emi-amount">₹{Math.round(monthlyEMI).toLocaleString()}</span>
                  </div>
                  <div className="td-emi-breakdown">
                    <div className="td-breakdown-row">
                      <span className="td-breakdown-dot principal"></span>
                      <span className="td-breakdown-label">Principal</span>
                      <span className="td-breakdown-value">₹{(financeAmount - initialPayment).toLocaleString()}</span>
                    </div>
                    <div className="td-breakdown-row">
                      <span className="td-breakdown-dot interest"></span>
                      <span className="td-breakdown-label">Interest ({rateOfInterest}%)</span>
                      <span className="td-breakdown-value">₹{Math.round(interestAmount).toLocaleString()}</span>
                    </div>
                    <div className="td-breakdown-row total">
                      <span className="td-breakdown-label">Total Payable</span>
                      <span className="td-breakdown-value">₹{Math.round((financeAmount - initialPayment) + interestAmount).toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="td-check-eligibility">
                    Check Loan Eligibility
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                  <p className="td-disclaimer">*Subject to lender approval</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Why Axlerator */}
      <div className="td-advantages">
        <h2>Why Choose Axlerator</h2>
        <div className="td-advantages-grid">
          {axleratorAdvantages.map((adv, idx) => (
            <div key={idx} className="td-advantage-card" style={{ '--accent': adv.color } as React.CSSProperties}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <span className="td-adv-title">{adv.title}</span>
                <span className="td-adv-desc">{adv.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Trucks */}
      {similarTrucks.length > 0 && (
        <div className="td-similar">
          <div className="td-similar-header">
            <h2>Similar Trucks</h2>
            <Link href="/browse-trucks" className="td-view-all">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="td-similar-grid">
            {similarTrucks.map((st) => (
              <Link href={`/truck/${st.id}`} key={st.id} className="td-similar-card">
                <div className="td-similar-img">
                  <Image src={st.imageUrl} alt={st.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  <span className="td-similar-certified">Certified</span>
                </div>
                <div className="td-similar-info">
                  <h4>{st.year} {st.name}</h4>
                  <p>{st.kilometers?.toLocaleString()} km • Diesel • Manual</p>
                  <div className="td-similar-bottom">
                    <span className="td-similar-price">{displayPrice(st.price)}</span>
                    <span className="td-similar-cta">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Explore More */}
      <div className="td-explore">
        <h3>Explore More</h3>
        <div className="td-explore-links">
          <Link href={`/browse-trucks?brand=${truck.manufacturer}`}>More {truck.manufacturer} Trucks</Link>
          <Link href="/browse-trucks?priceMax=3000000">Trucks Under ₹30L</Link>
          <Link href="/browse-trucks">All Trucks</Link>
          <Link href="/sell-truck" className="highlight">Sell Your Truck</Link>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactForm && (
        <div className="td-modal-overlay" onClick={() => setShowContactForm(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <button className="td-modal-close" onClick={() => setShowContactForm(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <h2>Get Best Price</h2>
            <p>for {truck.year} {truck.name}</p>
            <form className="td-modal-form" onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const name = formData.get('name') as string
              const phone = formData.get('phone') as string
              const email = formData.get('email') as string
              
              try {
                const response = await fetch('/api/inquiries', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    truckId: truck.id,
                    truckName: `${truck.year} ${truck.name}`,
                    name,
                    email: email || '',
                    phone,
                    message: `Price inquiry for ${truck.year} ${truck.name}`
                  })
                })
                
                if (response.ok) {
                  alert('Thank you! We will contact you soon with the best price.')
                  setShowContactForm(false)
                  e.currentTarget.reset()
                } else {
                  alert('Failed to submit. Please try again.')
                }
              } catch (error) {
                console.error('Error submitting inquiry:', error)
                alert('Failed to submit. Please try again.')
              }
            }}>
              <input type="text" name="name" placeholder="Full Name" required />
              <input type="tel" name="phone" placeholder="Phone Number" required />
              <input type="email" name="email" placeholder="Email (Optional)" />
              <button type="submit">Submit Enquiry</button>
            </form>
          </div>
        </div>
      )}

      {/* Test Drive Booking Modal */}
      {showTestDriveForm && (
        <div className="td-modal-overlay" onClick={() => setShowTestDriveForm(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <button className="td-modal-close" onClick={() => setShowTestDriveForm(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <h2>Book a Test Drive</h2>
            <p>for {truck.year} {truck.name}</p>
            <form className="td-modal-form" onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const name = formData.get('name') as string
              const phone = formData.get('phone') as string
              const email = formData.get('email') as string
              
              try {
                const response = await fetch('/api/inquiries', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    truckId: truck.id,
                    truckName: `${truck.year} ${truck.name}`,
                    name,
                    email: email || '',
                    phone,
                    message: `Test drive booking request for ${truck.year} ${truck.name}`
                  })
                })
                
                if (response.ok) {
                  alert('Thank you! We will contact you soon to schedule your test drive.')
                  setShowTestDriveForm(false)
                  e.currentTarget.reset()
                } else {
                  alert('Failed to submit. Please try again.')
                }
              } catch (error) {
                console.error('Error submitting test drive request:', error)
                alert('Failed to submit. Please try again.')
              }
            }}>
              <input type="text" name="name" placeholder="Full Name" required />
              <input type="tel" name="phone" placeholder="Phone Number" required />
              <input type="email" name="email" placeholder="Email (Optional)" />
              <button type="submit">Submit Enquiry</button>
            </form>
          </div>
        </div>
      )}

      {/* Full Report Modal */}
      {showFullReport && (
        <div className="td-report-modal-overlay" onClick={() => setShowFullReport(false)}>
          <div className="td-report-modal" onClick={e => e.stopPropagation()}>
            <div className="td-report-modal-header">
              <button className="td-report-back" onClick={() => setShowFullReport(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Truck Quality Report
              </button>
            </div>
            
            <div className="td-report-modal-hero">
              <div className="td-report-modal-info">
                <h2>{truck.year} {truck.name}</h2>
                <p>{truck.kilometers?.toLocaleString()} km • Diesel • Manual</p>
                <div className="td-assured-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Assured
                  <span className="td-know-more">Know more</span>
                </div>
              </div>
              <div className="td-report-modal-image">
                <Image src={truck.imageUrl} alt={truck.name} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
            </div>

            <div className="td-report-modal-content">
              <h4 className="td-modal-highlights-title">HIGHLIGHTS</h4>
              <div className="td-modal-highlights">
                {truckHighlights.map((h, idx) => (
                  <div key={idx} className="td-modal-highlight">
                    <div className="td-modal-highlight-icon">
                      {h.icon === 'power' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                        </svg>
                      )}
                      {h.icon === 'ac' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                          <path d="M12 2v10M12 12l8 4M12 12L4 16M12 12v10"/>
                          <path d="M17 7l-5 5-5-5"/>
                        </svg>
                      )}
                      {h.icon === 'brake' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="12" cy="12" r="4"/>
                          <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
                        </svg>
                      )}
                      {h.icon === 'fuel' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                          <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>
                          <path d="M3 10h12M7 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
                          <path d="M15 6h2a2 2 0 0 1 2 2v4l2 2v6h-2"/>
                        </svg>
                      )}
                    </div>
                    <span className="td-modal-highlight-label">{h.label}</span>
                    <span className="td-modal-highlight-desc">{h.desc}</span>
                  </div>
                ))}
              </div>

              <div className="td-modal-score-tabs">
                {Object.entries(inspectionData).map(([key, data]) => (
                  <button
                    key={key}
                    className={`td-modal-score-tab ${activeReportTab === key ? 'active' : ''}`}
                    onClick={() => setActiveReportTab(key)}
                  >
                    {data.label}
                    <span style={{ background: getScoreColor(data.score) }}>{data.score}</span>
                  </button>
                ))}
              </div>

              <button className="td-modal-scores-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                See how scores are calculated?
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              {/* Detailed Inspection Cards */}
              {Object.entries(inspectionData).map(([key, data]) => (
                <div key={key} className="td-modal-category">
                  <div className="td-modal-category-header">
                    <div className="td-modal-cat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M3 9h18M9 21V9"/>
                      </svg>
                    </div>
                    <div className="td-modal-cat-info">
                      <span className="td-modal-cat-name">{data.label}</span>
                      <span className="td-modal-cat-parts">{data.parts} parts across {data.assemblies} assemblies</span>
                    </div>
                    <div className="td-modal-cat-score" style={{ background: getScoreColor(data.score) }}>
                      {data.score}
                      <small>{data.status}</small>
                    </div>
                  </div>
                  <div className="td-modal-cat-items">
                    {data.items.map((item, idx) => (
                      <div key={idx} className="td-modal-cat-item">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#059669">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M8 12l2.5 2.5L16 9" stroke="white" strokeWidth="2" fill="none"/>
                        </svg>
                        <div className="td-modal-item-info">
                          <span className="td-modal-item-name">{item.name}</span>
                          <span className="td-modal-item-status">{item.status}</span>
                        </div>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report OTP Modal */}
      {showReportOTPModal && (
        <div className="td-modal-overlay" onClick={() => setShowReportOTPModal(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <button className="td-modal-close" onClick={() => setShowReportOTPModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h2>Verify Phone to View Full Report</h2>
            <p>Enter your phone number to receive a one-time password (OTP) and unlock the detailed quality report.</p>

            <form
              className="td-modal-form"
              onSubmit={async (e) => {
                e.preventDefault()
                if (reportOTPStep === 'phone') {
                  await handleSendReportOTP()
                } else {
                  await handleVerifyReportOTP()
                }
              }}
            >
              {reportOTPStep === 'phone' && (
                <>
                  <input
                    type="tel"
                    name="report-phone"
                    placeholder="Phone Number"
                    value={reportPhone}
                    onChange={(e) => setReportPhone(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={reportOTPLoading}>
                    {reportOTPLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </>
              )}

              {reportOTPStep === 'otp' && (
                <>
                  <input
                    type="tel"
                    name="report-otp"
                    placeholder="Enter 6-digit OTP"
                    value={reportOTP}
                    onChange={(e) => setReportOTP(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={reportOTPLoading}>
                    {reportOTPLoading ? 'Verifying...' : 'Verify & View Report'}
                  </button>
                  <button
                    type="button"
                    className="td-secondary-link"
                    onClick={handleSendReportOTP}
                    disabled={reportOTPLoading}
                  >
                    Resend OTP
                  </button>
                </>
              )}

              {reportOTPError && (
                <p className="td-error-text" style={{ marginTop: '0.75rem' }}>
                  {reportOTPError}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
