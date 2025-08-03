"use client"
import dynamic from "next/dynamic"
import { TimelineSlider } from "../components/TimelineSlider"
import { Sidebar } from "../components/Sidebar"
import { useWeatherData } from "../hooks/useWeatherData"

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(
  () => import("../components/MapComponent").then((mod) => ({ default: mod.MapComponent })),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading map...</div>,
  },
)

export default function Dashboard() {
  // Initialize weather data fetching
  useWeatherData()

  return (
    <div className="h-screen flex flex-col">
      {/* Timeline Slider */}
      <TimelineSlider />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map */}
        <div className="flex-1">
          <MapComponent />
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  )
}
