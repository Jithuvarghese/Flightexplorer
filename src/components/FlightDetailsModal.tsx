import { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

type Flight = {
  id: string
  flightNumber?: string
  airline?: string
  origin?: { code?: string; name?: string; city?: string }
  destination?: { code?: string; name?: string; city?: string }
  departure?: { scheduled?: string; actual?: string; terminal?: string; gate?: string }
  arrival?: { scheduled?: string; estimated?: string; terminal?: string; gate?: string }
  status?: string
  aircraft?: string
  duration?: string
  delay?: number
}

type FlightDetailsModalProps = {
  flight: Flight | null
  onClose: () => void
}

export default function FlightDetailsModal({ flight, onClose }: FlightDetailsModalProps) {
  const { theme } = useTheme()
  const [isClosing, setIsClosing] = useState(false)
  
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 500) // Match animation duration
  }
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    
    if (flight) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [flight])

  if (!flight) return null

  const fmt = (iso?: string) => {
    if (!iso) return '—'
    try {
      return new Date(iso).toLocaleString()
    } catch {
      return iso
    }
  }

  const bgColor = theme === 'dark' ? '#0f172a' : '#ffffff'
  const borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  const textPrimary = theme === 'dark' ? '#f1f5f9' : '#0f172a'
  const textSecondary = theme === 'dark' ? '#94a3b8' : '#64748b'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ 
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
        fontFamily: "'Barlow Condensed', sans-serif",
        animation: isClosing ? 'fadeOut 0.5s ease-out' : 'fadeIn 0.5s ease-out'
      }}
      onClick={handleClose}
    >
      <div
        className="rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: '1px',
          animation: isClosing ? 'slideDown 0.5s ease-out' : 'slideUp 0.5s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 p-6 flex items-start justify-between transition-colors duration-300"
          style={{
            backgroundColor: bgColor,
            borderBottomColor: borderColor,
            borderBottomWidth: '1px'
          }}
        >
          <div>
            <h2 
              className="text-2xl transition-colors duration-300" 
              style={{ 
                fontFamily: "'Barlow Condensed', sans-serif", 
                fontWeight: 700,
                color: textPrimary
              }}
            >
              {flight.flightNumber || flight.id}
            </h2>
            <p 
              className="mt-1 transition-colors duration-300" 
              style={{ 
                fontFamily: "'Barlow Condensed', sans-serif", 
                fontWeight: 400,
                color: textSecondary
              }}
            >
              {flight.airline || '—'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="transition-colors p-2 rounded-md"
            style={{
              color: textSecondary
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = textPrimary}
            onMouseLeave={(e) => e.currentTarget.style.color = textSecondary}
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
              {flight.status || 'Status Unknown'}
            </span>
            {typeof flight.delay === 'number' && flight.delay > 0 && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                Delayed {flight.delay} min
              </span>
            )}
          </div>

          {/* Route */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-sm text-slate-400 mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>Route</h3>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl text-slate-100" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                  {flight.origin?.code || '—'}
                </div>
                <div className="text-sm text-slate-400 mt-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400 }}>{flight.origin?.name || '—'}</div>
                <div className="text-xs text-slate-500" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 300 }}>{flight.origin?.city || ''}</div>
              </div>
              <div className="flex-shrink-0 px-4">
                <svg
                  className="w-8 h-8 text-slate-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
              <div className="flex-1 text-right">
                <div className="text-2xl text-slate-100" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                  {flight.destination?.code || '—'}
                </div>
                <div className="text-sm text-slate-400 mt-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400 }}>
                  {flight.destination?.name || '—'}
                </div>
                <div className="text-xs text-slate-500" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 300 }}>{flight.destination?.city || ''}</div>
              </div>
            </div>
          </div>

          {/* Departure Information */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Departure</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled:</span>
                <span className="text-slate-100 font-medium">
                  {fmt(flight.departure?.scheduled)}
                </span>
              </div>
              {flight.departure?.actual && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Actual:</span>
                  <span className="text-slate-100 font-medium">
                    {fmt(flight.departure.actual)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Terminal:</span>
                <span className="text-slate-100 font-medium">
                  {flight.departure?.terminal || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gate:</span>
                <span className="text-slate-100 font-medium">
                  {flight.departure?.gate || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Arrival Information */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Arrival</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled:</span>
                <span className="text-slate-100 font-medium">
                  {fmt(flight.arrival?.scheduled)}
                </span>
              </div>
              {flight.arrival?.estimated && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated:</span>
                  <span className="text-slate-100 font-medium">
                    {fmt(flight.arrival.estimated)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Terminal:</span>
                <span className="text-slate-100 font-medium">
                  {flight.arrival?.terminal || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gate:</span>
                <span className="text-slate-100 font-medium">
                  {flight.arrival?.gate || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Additional Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Aircraft:</span>
                <span className="text-slate-100 font-medium">{flight.aircraft || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-100 font-medium">{flight.duration || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flight ID:</span>
                <span className="text-slate-100 font-mono text-sm">{flight.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-4">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
