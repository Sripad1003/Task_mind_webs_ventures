import type { ColorRule, WeatherData } from "../types"

/**
 * Calculates the centroid of a polygon.
 * @param points An array of [latitude, longitude] pairs.
 * @returns A [latitude, longitude] pair representing the centroid.
 */
export function calculatePolygonCentroid(points: [number, number][]): [number, number] {
  if (points.length === 0) return [0, 0]

  let latSum = 0
  let lngSum = 0
  for (const [lat, lng] of points) {
    latSum += lat
    lngSum += lng
  }
  return [latSum / points.length, lngSum / points.length]
}

/**
 * Calculates the bounding box (min/max lat/lng) of a polygon.
 * @param points An array of [latitude, longitude] pairs.
 * @returns An object with north, south, east, west bounds.
 */
export function calculateBoundingBox(points: [number, number][]) {
  if (points.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 }
  }

  let minLat = points[0][0]
  let maxLat = points[0][0]
  let minLng = points[0][1]
  let maxLng = points[0][1]

  for (const [lat, lng] of points) {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
  }

  return { north: maxLat, south: minLat, east: maxLng, west: minLng }
}

/**
 * Fetches weather data from Open-Meteo API for a given location and time range.
 * @param latitude Latitude of the location.
 * @param longitude Longitude of the location.
 * @param startDate Start date for the data.
 * @param endDate End date for the data.
 * @param hourlyFields Array of hourly weather fields to fetch (e.g., ["temperature_2m"]).
 * @returns WeatherData object or null if an error occurs.
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  startDate: Date,
  endDate: Date,
  hourlyFields: string[],
): Promise<WeatherData | null> {
  const start = startDate.toISOString().split("T")[0]
  const end = endDate.toISOString().split("T")[0]
  const fields = hourlyFields.join(",")

  // Using the archive API as requested
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${start}&end_date=${end}&hourly=${fields}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: WeatherData = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return null
  }
}

/**
 * Applies color rules to a given value.
 * @param value The data value to evaluate.
 * @param rules An array of ColorRule objects.
 * @returns The hex color string that matches the first rule, or a default grey if no rule matches.
 */
export function applyColorRules(value: number, rules: ColorRule[]): string {
  // Sort rules to ensure correct precedence if operators overlap (e.g., <10, >=10)
  // For simplicity, we assume rules are ordered from most specific to least specific,
  // or that they are mutually exclusive.
  // A more robust solution might involve sorting by operator type or value.

  for (const rule of rules) {
    let matches = false
    switch (rule.operator) {
      case "<":
        matches = value < rule.value
        break
      case "<=":
        matches = value <= rule.value
        break
      case "=":
        matches = value === rule.value
        break
      case ">=":
        matches = value >= rule.value
        break
      case ">":
        matches = value > rule.value
        break
      default:
        break
    }
    if (matches) {
      return rule.color
    }
  }
  return "#cccccc" // Default color if no rule matches
}
