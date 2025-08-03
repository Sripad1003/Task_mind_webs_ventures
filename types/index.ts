export interface TimeRange {
  start: Date
  end: Date
}

export interface Point {
  lat: number
  lng: number
}

export interface Polygon {
  id: string
  name: string
  points: Point[]
  dataSource: string
  color: string // This will be the default color, actual display color comes from polygonData
  centroid: Point
  boundingBox: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface ColorRule {
  id: string
  field: string
  operator: "=" | "<" | ">" | "<=" | ">="
  value: number
  color: string
}

export interface DataSource {
  id: string
  name: string
  fields: string[]
  colorRules: ColorRule[]
}

export interface WeatherData {
  latitude: number
  longitude: number
  hourly: {
    time: string[]
    temperature_2m: number[]
    // Add other potential hourly fields here if needed
  }
  // Add other potential data types here (e.g., daily, current)
}

export interface PolygonData {
  polygonId: string
  timestamp: string // The timestamp for which this data point is valid
  value: number // The fetched data value for the polygon
  color: string // The color determined by applying color rules
}
