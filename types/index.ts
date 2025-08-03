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
  color: string
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
  }
}

export interface PolygonData {
  polygonId: string
  timestamp: string
  value: number
  color: string
}
