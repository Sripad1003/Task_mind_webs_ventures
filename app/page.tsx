"use client"

import { MapComponent } from "@/components/MapComponent"
import { Sidebar } from "@/components/Sidebar"
import { TimelineSlider } from "@/components/TimelineSlider"
import { useWeatherData } from "@/hooks/useWeatherData"

export default function Home() {
  // This hook fetches data and updates polygon colors based on timeline and rules
  useWeatherData()

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex flex-1 flex-col">
        <div className="relative flex-1">
          <MapComponent />
        </div>
        <div className="h-32 flex-shrink-0 border-t border-gray-200 p-4">
          <TimelineSlider />
        </div>
      </div>
      <Sidebar />
    </div>
  )
}
