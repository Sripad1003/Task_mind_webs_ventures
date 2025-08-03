import { create } from "zustand"
import type { TimeRange, Polygon, DataSource, ColorRule, PolygonData } from "../types"

interface AppState {
  // Timeline state
  timeRange: TimeRange
  isRangeMode: boolean
  selectedHour: Date

  // Map state
  mapCenter: [number, number]
  isDrawing: boolean
  currentDrawingPoints: [number, number][]

  // Polygons state
  polygons: Polygon[]
  selectedPolygon: string | null

  // Data sources state
  dataSources: DataSource[]
  selectedDataSource: string

  // Polygon data state
  polygonData: PolygonData[]

  // Actions
  setTimeRange: (range: TimeRange) => void
  setIsRangeMode: (mode: boolean) => void
  setSelectedHour: (hour: Date) => void
  setMapCenter: (center: [number, number]) => void
  setIsDrawing: (drawing: boolean) => void
  setCurrentDrawingPoints: (points: [number, number][]) => void
  addPolygon: (polygon: Polygon) => void
  removePolygon: (id: string) => void
  setSelectedPolygon: (id: string | null) => void
  addDataSource: (dataSource: DataSource) => void
  updateDataSource: (id: string, dataSource: Partial<DataSource>) => void
  setSelectedDataSource: (id: string) => void
  addColorRule: (dataSourceId: string, rule: ColorRule) => void
  removeColorRule: (dataSourceId: string, ruleId: string) => void
  updatePolygonData: (data: PolygonData[]) => void
}

const today = new Date()
const fifteenDaysAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
const fifteenDaysLater = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  timeRange: { start: fifteenDaysAgo, end: fifteenDaysLater },
  isRangeMode: false,
  selectedHour: today,
  mapCenter: [40.7128, -74.006], // New York City
  isDrawing: false,
  currentDrawingPoints: [],
  polygons: [],
  selectedPolygon: null,
  dataSources: [
    {
      id: "open-meteo",
      name: "Open-Meteo Weather",
      fields: ["temperature_2m"],
      colorRules: [
        { id: "1", field: "temperature_2m", operator: "<", value: 10, color: "#ff4d4f" },
        { id: "2", field: "temperature_2m", operator: ">=", value: 10, color: "#1890ff" },
        { id: "3", field: "temperature_2m", operator: ">=", value: 25, color: "#52c41a" },
      ],
    },
  ],
  selectedDataSource: "open-meteo",
  polygonData: [],

  // Actions
  setTimeRange: (range) => set({ timeRange: range }),
  setIsRangeMode: (mode) => set({ isRangeMode: mode }),
  setSelectedHour: (hour) => set({ selectedHour: hour }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  setCurrentDrawingPoints: (points) => set({ currentDrawingPoints: points }),

  addPolygon: (polygon) =>
    set((state) => ({
      polygons: [...state.polygons, polygon],
    })),

  removePolygon: (id) =>
    set((state) => ({
      polygons: state.polygons.filter((p) => p.id !== id),
      selectedPolygon: state.selectedPolygon === id ? null : state.selectedPolygon,
    })),

  setSelectedPolygon: (id) => set({ selectedPolygon: id }),

  addDataSource: (dataSource) =>
    set((state) => ({
      dataSources: [...state.dataSources, dataSource],
    })),

  updateDataSource: (id, updates) =>
    set((state) => ({
      dataSources: state.dataSources.map((ds) => (ds.id === id ? { ...ds, ...updates } : ds)),
    })),

  setSelectedDataSource: (id) => set({ selectedDataSource: id }),

  addColorRule: (dataSourceId, rule) =>
    set((state) => ({
      dataSources: state.dataSources.map((ds) =>
        ds.id === dataSourceId ? { ...ds, colorRules: [...ds.colorRules, rule] } : ds,
      ),
    })),

  removeColorRule: (dataSourceId, ruleId) =>
    set((state) => ({
      dataSources: state.dataSources.map((ds) =>
        ds.id === dataSourceId ? { ...ds, colorRules: ds.colorRules.filter((r) => r.id !== ruleId) } : ds,
      ),
    })),

  updatePolygonData: (data) => set({ polygonData: data }),
}))
