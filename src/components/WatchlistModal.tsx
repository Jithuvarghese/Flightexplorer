import { useEffect, useState } from 'react'

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

type WatchlistModalProps = {
  isOpen: boolean
  onClose: () => void
  watchlist: Flight[]
  onRemove: (flightId: string) => void
  onViewDetails: (flight: Flight) => void
}

export default function WatchlistModal({ 
  isOpen, 
  onClose, 
  watchlist, 
  onRemove,
  onViewDetails 
}: WatchlistModalProps) {
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
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const getStatusColor = (status?: string): string => {
    if (!status) return '#6B7280' // Gray for unknown
    const statusLower = status.toLowerCase()
    
    if (statusLower.includes('active') || statusLower.includes('in progress')) return '#2196F3' // Blue
    if (statusLower.includes('departed')) return '#9C27B0' // Purple
    if (statusLower.includes('cancelled') || statusLower.includes('canceled')) return '#F44336' // Red
    if (statusLower.includes('on time') || statusLower.includes('scheduled')) return '#4CAF50' // Green
    if (statusLower.includes('boarding')) return '#FF9800' // Orange
    if (statusLower.includes('delayed') || statusLower.includes('delay')) return '#FFC107' // Amber
    
    return '#6B7280' // Default gray
  }

  const fmt = (iso?: string) => {
    if (!iso) return '—'
    try {
      const date = new Date(iso)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return iso
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
      style={{ 
        fontFamily: "'Barlow Condensed', sans-serif",
        animation: isClosing ? 'fadeOut 0.5s ease-out' : 'fadeIn 0.5s ease-out'
      }}
    >
      <div
        className="bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isClosing ? 'slideDown 0.5s ease-out' : 'slideUp 0.5s ease-out'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl text-slate-100" style={{ fontWeight: 700 }}>
              My Watchlist
            </h2>
            <p className="text-slate-400 mt-1" style={{ fontWeight: 400 }}>
              {watchlist.length} {watchlist.length === 1 ? 'flight' : 'flights'} tracked
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-100 transition-colors p-2 hover:bg-white/5 rounded-md"
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
        <div className="p-6">
          {watchlist.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-slate-600 mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
              <p className="text-slate-400 text-lg" style={{ fontWeight: 400 }}>
                No flights in your watchlist yet
              </p>
              <p className="text-slate-500 text-sm mt-2" style={{ fontWeight: 300 }}>
                Click the bookmark icon on any flight to track it
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {watchlist.map((flight) => (
                <div
                  key={flight.id}
                  className="p-4 bg-black/30 rounded-md ring-1 ring-white/10 hover:ring-white/20 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <div className="text-lg text-slate-100" style={{ fontWeight: 700 }}>
                          {flight.flightNumber || flight.id}
                        </div>
                        <div className="text-sm text-slate-400" style={{ fontWeight: 400 }}>
                          {flight.airline || '—'}
                        </div>
                        {flight.status && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs text-white"
                            style={{ 
                              backgroundColor: getStatusColor(flight.status),
                              fontWeight: 600 
                            }}
                          >
                            {flight.status}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" style={{ fontWeight: 600 }}>
                            {flight.origin?.code || '—'}
                          </span>
                          <svg
                            className="w-5 h-5 text-slate-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                          </svg>
                          <span className="text-lg" style={{ fontWeight: 600 }}>
                            {flight.destination?.code || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-slate-400" style={{ fontWeight: 400 }}>
                        {fmt(flight.departure?.scheduled)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(flight)}
                        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onRemove(flight.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                        aria-label="Remove from watchlist"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-4">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-md transition-colors"
            style={{ fontWeight: 500 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
