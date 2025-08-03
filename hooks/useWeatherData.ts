"use client"

import { useEffect } from "react"
import { useStore } from "../store/useStore"
import { fetchWeatherData, applyColorRules } from "../utils/api"
import type { PolygonData } from "../types"

export const useWeatherData = () => {
  const { polygons, selectedHour, isRangeMode, timeRange, dataSources, selectedDataSource, updatePolygonData } =
    useStore()

  useEffect(() => {
    const fetchDataAndApplyRules = async () => {
      if (polygons.length === 0) {
        updatePolygonData([])
        return
      }

      const currentDataSource = dataSources.find((ds) => ds.id === selectedDataSource)
      if (!currentDataSource) {
        console.warn(`Data source with ID ${selectedDataSource} not found.`)
        updatePolygonData([])
        return
      }

      const polygonDataPromises = polygons.map(async (polygon) => {
        try {
          const startDate = isRangeMode ? timeRange.start : selectedHour
          const endDate = isRangeMode ? timeRange.end : selectedHour

          const weatherData = await fetchWeatherData(
            polygon.centroid.lat,
            polygon.centroid.lng,
            startDate,
            endDate,
            currentDataSource.fields,
          )

          // For simplicity, we'll take the average or first value for the selected field
          // In a real app, you might want more sophisticated aggregation
          const fieldValues = weatherData?.hourly?.[currentDataSource.fields[0] as keyof typeof weatherData.hourly]
          const value = fieldValues && fieldValues.length > 0 ? fieldValues[0] : null

          const color = value !== null ? applyColorRules(value, currentDataSource.colorRules) : "#cccccc" // Default grey if no value

          return {
            polygonId: polygon.id,
            timestamp: selectedHour.toISOString(), // Or a relevant timestamp from weatherData
            value: value !== null ? value : 0, // Default to 0 if null
            color: color,
          } as PolygonData
        } catch (error) {
          console.error(`Error fetching data for polygon ${polygon.id}:`, error)
          return {
            polygonId: polygon.id,
            timestamp: selectedHour.toISOString(),
            value: 0,
            color: "#cccccc", // Grey for error/no data
          } as PolygonData
        }
      })

      const newPolygonData = await Promise.all(polygonDataPromises)
      updatePolygonData(newPolygonData)
    }

    fetchDataAndApplyRules()
  }, [polygons, selectedHour, isRangeMode, timeRange, dataSources, selectedDataSource, updatePolygonData])
}
