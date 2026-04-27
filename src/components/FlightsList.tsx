import { useEffect, useState } from 'react'
// @ts-ignore - flights.js is a JavaScript module without types
import { getFlights } from '@/api/flights'
import SearchForm from './SearchForm'
import type { SearchFilters } from './SearchForm'
import FlightDetailsModal from './FlightDetailsModal'
import WatchlistModal from './WatchlistModal'
import Loader from './Loader'
import { useTheme } from '@/context/ThemeContext'
import { getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/utils/watchlist'

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

export default function FlightsList() {
  const { theme } = useTheme()
  const [flights, setFlights] = useState<Flight[] | null>(null)
  const [filteredFlights, setFilteredFlights] = useState<Flight[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [watchlistOpen, setWatchlistOpen] = useState(false)
  const [watchlist, setWatchlist] = useState<Flight[]>([])
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set())
  const [openedFromWatchlist, setOpenedFromWatchlist] = useState(false)

  // Load watchlist from localStorage
  useEffect(() => {
    const loadedWatchlist = getWatchlist()
    setWatchlist(loadedWatchlist)
    setWatchlistIds(new Set(loadedWatchlist.map(f => f.id)))
  }, [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getFlights()
      .then((data: any) => {
        if (!mounted) return
        const flightArray = Array.isArray(data) ? data : []
        setFlights(flightArray)
        setFilteredFlights(flightArray)
      })
      .catch((err: any) => {
        if (!mounted) return
        setError(err?.message || String(err))
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  // Extract unique airlines from flights
  const getUniqueAirlines = (): string[] => {
    if (!flights) return []
    const airlines = flights
      .map((f) => f.airline)
      .filter((airline): airline is string => !!airline)
    return Array.from(new Set(airlines)).sort()
  }

  // Extract unique airports from flights
  const getUniqueAirports = () => {
    if (!flights) return []
    const airportMap = new Map<string, { code: string; name?: string }>()
    
    flights.forEach((f) => {
      if (f.origin?.code) {
        airportMap.set(f.origin.code, {
          code: f.origin.code,
          name: f.origin.name || f.origin.city
        })
      }
      if (f.destination?.code) {
        airportMap.set(f.destination.code, {
          code: f.destination.code,
          name: f.destination.name || f.destination.city
        })
      }
    })
    
    return Array.from(airportMap.values()).sort((a, b) => a.code.localeCompare(b.code))
  }

  const handleAddToWatchlist = (flight: Flight) => {
    addToWatchlist(flight)
    const updatedWatchlist = getWatchlist()
    setWatchlist(updatedWatchlist)
    setWatchlistIds(new Set(updatedWatchlist.map(f => f.id)))
  }

  const handleRemoveFromWatchlist = (flightId: string) => {
    removeFromWatchlist(flightId)
    const updatedWatchlist = getWatchlist()
    setWatchlist(updatedWatchlist)
    setWatchlistIds(new Set(updatedWatchlist.map(f => f.id)))
  }

  const handleToggleWatchlist = (flight: Flight) => {
    if (isInWatchlist(flight.id)) {
      handleRemoveFromWatchlist(flight.id)
    } else {
      handleAddToWatchlist(flight)
    }
  }

  const filterFlights = (filters: SearchFilters) => {
    if (!flights) return

    let filtered = flights

    // Filter by flight number
    if (filters.flightNumber) {
      filtered = filtered.filter((flight) =>
        flight.flightNumber?.toUpperCase().includes(filters.flightNumber.toUpperCase())
      )
    }

    // Filter by airline
    if (filters.airline) {
      filtered = filtered.filter((flight) =>
        flight.airline?.toUpperCase().includes(filters.airline.toUpperCase())
      )
    }

    // Filter by origin
    if (filters.origin) {
      filtered = filtered.filter((flight) =>
        flight.origin?.code?.toUpperCase() === filters.origin.toUpperCase()
      )
    }

    // Filter by destination
    if (filters.destination) {
      filtered = filtered.filter((flight) =>
        flight.destination?.code?.toUpperCase() === filters.destination.toUpperCase()
      )
    }

    setFilteredFlights(filtered)
    setActiveFilters(filters)
  }

  const handleReset = () => {
    setFilteredFlights(flights)
    setActiveFilters(null)
  }

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

  if (error) return <div className="p-4 text-red-400">Error: {error}</div>

  // Show only 10 flights when no search is active
  const displayFlights = activeFilters 
    ? (filteredFlights || []) 
    : (flights || []).slice(0, 10)

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

  // Show loader while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <header className="py-8">
        <h1 
          className="text-center text-5xl font-bold tracking-wider transition-colors duration-300" 
          style={{ 
            fontFamily: "'Barlow Condensed', sans-serif", 
            fontWeight: 700,
            color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
          }}
        >
          FlightRadar25
        </h1>
      </header>
      
      <div className="p-4 max-w-4xl mx-auto">
        <SearchForm 
          onSearch={filterFlights} 
          onReset={handleReset}
          airlines={getUniqueAirlines()}
          airports={getUniqueAirports()}
          onViewWatchlist={() => setWatchlistOpen(true)}
          watchlistCount={watchlist.length}
        />

      {activeFilters && displayFlights.length > 0 && (
        <div 
          className="mb-4 p-3 rounded-md text-sm transition-all duration-300" 
          style={{ 
            fontFamily: "'Barlow Condensed', sans-serif", 
            fontWeight: 500,
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)',
            borderColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.3)',
            borderWidth: '1px',
            color: theme === 'dark' ? '#93c5fd' : '#1d4ed8'
          }}
        >
          Found {displayFlights.length} flight{displayFlights.length !== 1 ? 's' : ''} matching your search
        </div>
      )}

      {displayFlights.length === 0 ? (
        <div 
          className="p-6 backdrop-blur-sm rounded-lg text-center transition-all duration-300" 
          style={{ 
            fontFamily: "'Barlow Condensed', sans-serif", 
            fontWeight: 400,
            backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: '1px',
            color: theme === 'dark' ? '#94a3b8' : '#64748b'
          }}
        >
          {activeFilters ? 'No flights match your search criteria.' : 'No flights available.'}
        </div>
      ) : (
        <>
          <h2 
            className="text-2xl mb-4 transition-colors duration-300" 
            style={{ 
              fontFamily: "'Barlow Condensed', sans-serif", 
              fontWeight: 600,
              color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
            }}
          >
            {activeFilters ? `Search Results (${displayFlights.length})` : 'Most Tracked Flights'}
          </h2>
          <ul className="space-y-3">
            {displayFlights.map((f) => (
              <li
                key={f.id}
                className="p-4 rounded-md shadow-sm backdrop-blur-sm transition-all duration-300"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderWidth: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.9)'
                  e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)'
                  e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 cursor-pointer" onClick={() => setSelectedFlight(f)}>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <div 
                        className="text-lg transition-colors duration-300" 
                        style={{ 
                          fontFamily: "'Barlow Condensed', sans-serif", 
                          fontWeight: 700,
                          color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
                        }}
                      >
                        {f.flightNumber || f.id}
                      </div>
                      <div 
                        className="text-sm transition-colors duration-300" 
                        style={{ 
                          fontFamily: "'Barlow Condensed', sans-serif", 
                          fontWeight: 400,
                          color: theme === 'dark' ? '#94a3b8' : '#64748b'
                        }}
                      >
                        {f.airline || '—'}
                      </div>
                      {f.status && (
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs text-white"
                          style={{ 
                            backgroundColor: getStatusColor(f.status),
                            fontFamily: "'Barlow Condensed', sans-serif", 
                            fontWeight: 600 
                          }}
                        >
                          {f.status}
                        </span>
                      )}
                    </div>

                    <div 
                      className="mt-2 flex items-center gap-4 transition-colors duration-300"
                      style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-lg" 
                          style={{ 
                            fontFamily: "'Barlow Condensed', sans-serif", 
                            fontWeight: 600,
                            color: theme === 'dark' ? '#cbd5e1' : '#475569'
                          }}
                        >
                          {f.origin?.code || '—'}
                        </span>
                        <svg
                          className="w-5 h-5 transition-colors duration-300"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: theme === 'dark' ? '#64748b' : '#94a3b8' }}
                        >
                          <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                        <span 
                          className="text-lg" 
                          style={{ 
                            fontFamily: "'Barlow Condensed', sans-serif", 
                            fontWeight: 600,
                            color: theme === 'dark' ? '#cbd5e1' : '#475569'
                          }}
                        >
                          {f.destination?.code || '—'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-slate-400" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400 }}>
                      {fmt(f.departure?.scheduled)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleWatchlist(f)
                      }}
                      className={`p-2 rounded-md transition-colors ${
                        watchlistIds.has(f.id)
                          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                          : 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10'
                      }`}
                      aria-label={watchlistIds.has(f.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <svg
                        className="w-5 h-5"
                        fill={watchlistIds.has(f.id) ? 'currentColor' : 'none'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                      </svg>
                    </button>
                    <div onClick={() => setSelectedFlight(f)} className="cursor-pointer flex items-center gap-2 text-slate-400 hover:text-slate-300">
                      <span className="text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500 }}>View Details</span>
                      <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <FlightDetailsModal 
        flight={selectedFlight} 
        onClose={() => {
          setSelectedFlight(null)
          if (openedFromWatchlist) {
            setWatchlistOpen(true)
            setOpenedFromWatchlist(false)
          }
        }} 
      />

      <WatchlistModal
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        watchlist={watchlist}
        onRemove={handleRemoveFromWatchlist}
        onViewDetails={(flight) => {
          setWatchlistOpen(false)
          setOpenedFromWatchlist(true)
          setSelectedFlight(flight)
        }}
      />
      </div>
    </>
  )
}
