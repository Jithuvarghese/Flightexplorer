import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTheme } from '@/context/ThemeContext'

export type SearchFilters = {
  flightNumber: string
  origin: string
  destination: string
  airline: string
}

type Airport = {
  code: string
  name?: string
}

type SearchFormProps = {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
  airlines: string[]
  airports: Airport[]
  onViewWatchlist: () => void
  watchlistCount: number
}

export default function SearchForm({ onSearch, onReset, airlines, airports, onViewWatchlist, watchlistCount }: SearchFormProps) {
  const { theme } = useTheme()
  const [flightNumber, setFlightNumber] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [airline, setAirline] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    // At least one field must be filled
    if (!flightNumber.trim() && !origin.trim() && !destination.trim() && !airline.trim()) {
      newErrors.general = 'Please enter at least one search criterion'
      setErrors(newErrors)
      return false
    }

    // If flight number is provided, validate format (e.g., AA123, BA456)
    if (flightNumber.trim()) {
      const flightNumberPattern = /^[A-Z]{2}\d{3,4}$/i
      if (!flightNumberPattern.test(flightNumber.trim())) {
        newErrors.flightNumber = 'Flight number should be in format like AA123 or BA1234'
      }
    }

    // If both origin and destination are provided, they shouldn't be the same
    if (
      origin.trim() &&
      destination.trim() &&
      origin.trim().toUpperCase() === destination.trim().toUpperCase()
    ) {
      newErrors.destination = 'Origin and destination cannot be the same'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSearch({
      flightNumber: flightNumber.trim().toUpperCase(),
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      airline: airline.trim().toUpperCase(),
    })
  }

  const handleReset = () => {
    setFlightNumber('')
    setOrigin('')
    setDestination('')
    setAirline('')
    setErrors({})
    onReset()
  }

  // Theme-aware styles
  const inputBg = theme === 'dark' ? '#002a3d' : '#ffffff'
  const inputBorder = theme === 'dark' ? '#004d6d' : '#cbd5e1'
  const inputText = theme === 'dark' ? '#f1f5f9' : '#0f172a'
  const labelText = theme === 'dark' ? '#cbd5e1' : '#475569'

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mb-8"
    >
      <div 
        className="w-full rounded-lg shadow-2xl transition-all duration-300"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(1, 21, 34, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: theme === 'dark' ? 'rgba(0, 61, 92, 0.5)' : 'rgba(203, 213, 225, 0.8)',
          borderWidth: '1px'
        }}
      >
        {/* macOS style traffic lights */}
        <div 
          className="flex items-center gap-1 px-3 py-3"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(0, 26, 38, 0.9)' : 'rgba(241, 245, 249, 0.9)'
          }}
        >
          <div className="w-3 h-3 rounded-full bg-[#ff605c]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd44]"></div>
          <div className="w-3 h-3 rounded-full bg-[#00ca4e]"></div>
        </div>

        {/* Card content */}
        <div 
          className="px-6 pb-6"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(1, 21, 34, 0.9)' : 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <h2 
            className="text-xl mb-4 transition-colors duration-300" 
            style={{ 
              fontFamily: "'Barlow Condensed', sans-serif", 
              fontWeight: 600,
              color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
            }}
          >
            Search Flights
          </h2>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
          {errors.general}
        </div>
      )}

      <div className="space-y-4">
        {/* Flight Number Search */}
        <div>
          <label 
            htmlFor="flightNumber" 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: labelText }}
          >
            Flight Number
          </label>
          <input
            type="text"
            id="flightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="e.g., AA123"
            className="w-full px-3 py-2 rounded-md placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors duration-300"
            style={{
              backgroundColor: inputBg,
              borderColor: inputBorder,
              borderWidth: '1px',
              color: inputText
            }}
          />
          {errors.flightNumber && (
            <p className="mt-1 text-sm text-red-400">{errors.flightNumber}</p>
          )}
        </div>

        {/* Airline Search */}
        <div>
          <label 
            htmlFor="airline" 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: labelText }}
          >
            Airline
          </label>
          <select
            id="airline"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            className="w-full px-3 py-2 rounded-md placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors duration-300"
            style={{
              backgroundColor: inputBg,
              borderColor: inputBorder,
              borderWidth: '1px',
              color: inputText
            }}
          >
            <option value="">Select airline...</option>
            {airlines.map((airlineName) => (
              <option key={airlineName} value={airlineName}>
                {airlineName}
              </option>
            ))}
          </select>
          {errors.airline && (
            <p className="mt-1 text-sm text-red-400">{errors.airline}</p>
          )}
        </div>

        <div 
          className="text-center text-sm font-medium transition-colors duration-300"
          style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}
        >
          OR
        </div>

        {/* Airport Route Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="origin" 
              className="block text-sm font-medium mb-1 transition-colors duration-300"
              style={{ color: labelText }}
            >
              Origin Airport
            </label>
            <select
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2 rounded-md placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors duration-300"
              style={{
                backgroundColor: inputBg,
                borderColor: inputBorder,
                borderWidth: '1px',
                color: inputText
              }}
            >
              <option value="">Select origin...</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.code} {airport.name && `- ${airport.name}`}
                </option>
              ))}
            </select>
            {errors.origin && <p className="mt-1 text-sm text-red-400">{errors.origin}</p>}
          </div>

          <div>
            <label 
              htmlFor="destination" 
              className="block text-sm font-medium mb-1 transition-colors duration-300"
              style={{ color: labelText }}
            >
              Destination Airport
            </label>
            <select
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 rounded-md placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors duration-300"
              style={{
                backgroundColor: inputBg,
                borderColor: inputBorder,
                borderWidth: '1px',
                color: inputText
              }}
            >
              <option value="">Select destination...</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.code} {airport.name && `- ${airport.name}`}
                </option>
              ))}
            </select>
            {errors.destination && (
              <p className="mt-1 text-sm text-red-400">{errors.destination}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
        >
          Search Flights
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onViewWatchlist}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 flex items-center justify-center gap-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
          </svg>
          View Watchlist
          {watchlistCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {watchlistCount}
            </span>
          )}
        </button>
      </div>
        </div>
      </div>
    </form>
  )
}
