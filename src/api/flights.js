import axios from "axios";

// Use a relative `/api` path so dev/prod proxies can forward requests and avoid CORS issues.
const BASE_URL = "/api/v1/flights";

const normalizeFlight = (item = {}) => {
  const departure = item.departure || {};
  const arrival = item.arrival || {};
  const airline = item.airline || {};
  const flight = item.flight || {};
  const aircraft = item.aircraft || {};

  const id =
    item.id ||
    [
      item.flight_date,
      flight.iata,
      departure.iata,
      arrival.iata,
      departure.scheduled,
    ]
      .filter(Boolean)
      .join("-") ||
    crypto.randomUUID();

  const departureDelay = typeof departure.delay === "number" ? departure.delay : null;
  const arrivalDelay = typeof arrival.delay === "number" ? arrival.delay : null;

  return {
    id,
    flightNumber: flight.iata || flight.icao || flight.number || id,
    airline: airline.name || airline.iata || "Unknown",
    origin: {
      code: departure.iata || departure.icao,
      name: departure.airport,
      city: departure.timezone,
    },
    destination: {
      code: arrival.iata || arrival.icao,
      name: arrival.airport,
      city: arrival.timezone,
    },
    departure: {
      scheduled: departure.scheduled,
      actual: departure.actual,
      terminal: departure.terminal,
      gate: departure.gate,
    },
    arrival: {
      scheduled: arrival.scheduled,
      estimated: arrival.estimated,
      terminal: arrival.terminal,
      gate: arrival.gate,
    },
    status: item.flight_status,
    aircraft: aircraft.model || aircraft.registration || "Unknown",
    duration: null,
    delay: Math.max(departureDelay || 0, arrivalDelay || 0) || 0,
  };
};

/**
 * Get all flights
 */
export const getFlights = async () => {
  try {
    const apiKey = import.meta.env.VITE_AVIATIONSTACK_API_KEY;

    if (!apiKey) {
      throw new Error("Missing VITE_AVIATIONSTACK_API_KEY in environment variables");
    }

    const response = await axios.get(`${BASE_URL}`, {
      params: {
        access_key: apiKey,
        limit: 100,
      },
    });

    // Normalize common response shapes:
    // - If API returns { flights: [...] } return the flights array
    // - If API returns { data: [...] } map Aviationstack payload to UI shape
    // - Otherwise return response.data directly (could already be an array)
    const data = response.data;
    if (Array.isArray(data?.data)) return data.data.map(normalizeFlight);
    return (data && data.flights) ? data.flights : data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
};
