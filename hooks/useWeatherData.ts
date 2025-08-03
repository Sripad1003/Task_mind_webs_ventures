"use client"

import { useEffect } from "react"
import { format } from "date-fns"
import { useStore } from "../store/useStore"
import { fetchWeatherData, applyColorRules } from "../utils/api"

export const useWeatherData = () => {
  const { polygons, timeRange, selectedHour, isRangeMode, dataSources, updatePolygonData } = useStore()

  useEffect(() => {
    const fetchDataForPolygons = async () => {
      if (polygons.length === 0) return

      const startDate = format(isRangeMode ? timeRange.start : selectedHour, "yyyy-MM-dd")
      const endDate = format(isRangeMode ? timeRange.end : selectedHour, "yyyy-MM-dd")

      const polygonDataPromises = polygons.map(async (polygon) => {
        try {
          const weatherData = await fetchWeatherData(polygon.centroid.lat, polygon.centroid.lng, startDate, endDate)

          // Get the data source for this polygon
          const dataSource = dataSources.find((ds) => ds.id === polygon.dataSource)
          if (!dataSource) return null

          // Calculate average temperature for the time range
          let avgTemperature = 0
          if (isRangeMode) {
            const relevantTemperatures = weatherData.hourly.temperature_2m.filter((_, index) => {
              const time = new Date(weatherData.hourly.time[index])
              return time >= timeRange.start && time <= timeRange.end
            })
            avgTemperature = relevantTemperatures.reduce((sum, temp) => sum + temp, 0) / relevantTemperatures.length
          } else {
            // Find the closest hour to selectedHour
            const selectedHourStr = format(selectedHour, "yyyy-MM-dd'T'HH:00")
            const hourIndex = weatherData.hourly.time.findIndex((time) => time.startsWith(selectedHourStr))
            avgTemperature = hourIndex >= 0 ? weatherData.hourly.temperature_2m[hourIndex] : 0
          }

          // Apply color rules
          const color = applyColorRules(avgTemperature, dataSource.colorRules)

          return {
            polygonId: polygon.id,
            timestamp: format(selectedHour, "yyyy-MM-dd'T'HH:mm:ss"),
            value: avgTemperature,
            color,
          }
        } catch (error) {
          console.error(`Error fetching data for polygon ${polygon.id}:`, error)
          return null
        }
      })

      const results = await Promise.all(polygonDataPromises)
      const validResults = results.filter((result) => result !== null)
      updatePolygonData(validResults)
    }

    fetchDataForPolygons()
  }, [polygons, timeRange, selectedHour, isRangeMode, dataSources, updatePolygonData])
}
