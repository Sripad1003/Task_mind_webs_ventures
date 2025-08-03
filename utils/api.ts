import type { WeatherData } from "../types"

export const fetchWeatherData = async (
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string,
): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&start_date=${startDate}&end_date=${endDate}&timezone=auto`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  return response.json()
}

export const calculatePolygonCentroid = (points: [number, number][]): [number, number] => {
  const x = points.reduce((sum, point) => sum + point[0], 0) / points.length
  const y = points.reduce((sum, point) => sum + point[1], 0) / points.length
  return [x, y]
}

export const calculateBoundingBox = (points: [number, number][]) => {
  const lats = points.map((p) => p[0])
  const lngs = points.map((p) => p[1])

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  }
}

export const applyColorRules = (value: number, rules: any[]): string => {
  // Sort rules by value to apply in correct order
  const sortedRules = [...rules].sort((a, b) => a.value - b.value)

  for (const rule of sortedRules) {
    switch (rule.operator) {
      case "<":
        if (value < rule.value) return rule.color
        break
      case "<=":
        if (value <= rule.value) return rule.color
        break
      case ">":
        if (value > rule.value) return rule.color
        break
      case ">=":
        if (value >= rule.value) return rule.color
        break
      case "=":
        if (value === rule.value) return rule.color
        break
    }
  }

  return "#cccccc" // Default color
}
