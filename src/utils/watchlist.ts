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

const WATCHLIST_KEY = 'flightRadar25_watchlist'

export const getWatchlist = (): Flight[] => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading watchlist:', error)
    return []
  }
}

export const addToWatchlist = (flight: Flight): void => {
  try {
    const watchlist = getWatchlist()
    const exists = watchlist.some(f => f.id === flight.id)
    
    if (!exists) {
      watchlist.push(flight)
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error)
  }
}

export const removeFromWatchlist = (flightId: string): void => {
  try {
    const watchlist = getWatchlist()
    const filtered = watchlist.filter(f => f.id !== flightId)
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error removing from watchlist:', error)
  }
}

export const isInWatchlist = (flightId: string): boolean => {
  try {
    const watchlist = getWatchlist()
    return watchlist.some(f => f.id === flightId)
  } catch (error) {
    console.error('Error checking watchlist:', error)
    return false
  }
}
