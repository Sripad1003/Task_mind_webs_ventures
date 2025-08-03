"use client"

import type React from "react"
import { MapContainer, TileLayer, Polygon as LeafletPolygon, useMapEvents, useMap } from "react-leaflet"
import { Button, message } from "antd"
import { useStore } from "../store/useStore"
import { calculatePolygonCentroid, calculateBoundingBox } from "../utils/api"
import "leaflet/dist/leaflet.css"

// Fix for default markers in react-leaflet
import L from "leaflet"
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
})

const MapEvents: React.FC = () => {
  const { isDrawing, currentDrawingPoints, setCurrentDrawingPoints, setIsDrawing, addPolygon, selectedDataSource } =
    useStore()

  useMapEvents({
    click: (e) => {
      if (isDrawing) {
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng]
        const newPoints = [...currentDrawingPoints, newPoint]

        if (newPoints.length >= 12) {
          message.warning("Maximum 12 points allowed per polygon")
          return
        }

        setCurrentDrawingPoints(newPoints)
      }
    },
    keydown: (e) => {
      if (e.originalEvent.key === "Enter" && isDrawing && currentDrawingPoints.length >= 3) {
        finishDrawing()
      } else if (e.originalEvent.key === "Escape" && isDrawing) {
        cancelDrawing()
      }
    },
  })

  const finishDrawing = () => {
    if (currentDrawingPoints.length < 3) {
      message.error("Minimum 3 points required for a polygon")
      return
    }

    const centroid = calculatePolygonCentroid(currentDrawingPoints)
    const boundingBox = calculateBoundingBox(currentDrawingPoints)

    const newPolygon = {
      id: `polygon-${Date.now()}`,
      name: `Polygon ${Date.now()}`,
      points: currentDrawingPoints.map(([lat, lng]) => ({ lat, lng })),
      dataSource: selectedDataSource,
      color: "#1890ff",
      centroid: { lat: centroid[0], lng: centroid[1] },
      boundingBox,
    }

    addPolygon(newPolygon)
    setCurrentDrawingPoints([])
    setIsDrawing(false)
    message.success("Polygon created successfully!")
  }

  const cancelDrawing = () => {
    setCurrentDrawingPoints([])
    setIsDrawing(false)
    message.info("Drawing cancelled")
  }

  return null
}

const MapControls: React.FC = () => {
  const { isDrawing, setIsDrawing, setMapCenter, currentDrawingPoints } = useStore()
  const map = useMap()

  const startDrawing = () => {
    setIsDrawing(true)
    message.info("Click on the map to add points. Press Enter to finish or Escape to cancel.")
  }

  const resetCenter = () => {
    const center: [number, number] = [40.7128, -74.006]
    map.setView(center, 10)
    setMapCenter(center)
  }

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      <Button type={isDrawing ? "primary" : "default"} onClick={startDrawing} disabled={isDrawing}>
        {isDrawing ? `Drawing (${currentDrawingPoints.length} points)` : "Draw Polygon"}
      </Button>
      <Button onClick={resetCenter}>Reset Center</Button>
    </div>
  )
}

export const MapComponent: React.FC = () => {
  const { mapCenter, polygons, currentDrawingPoints, polygonData } = useStore()

  const getPolygonColor = (polygonId: string): string => {
    const data = polygonData.find((d) => d.polygonId === polygonId)
    return data?.color || "#1890ff"
  }

  return (
    <div className="relative h-full">
      <MapContainer center={mapCenter} zoom={10} className="h-full w-full" zoomControl={false} scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapEvents />
        <MapControls />

        {/* Render existing polygons */}
        {polygons.map((polygon) => (
          <LeafletPolygon
            key={polygon.id}
            positions={polygon.points.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: getPolygonColor(polygon.id),
              fillColor: getPolygonColor(polygon.id),
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        ))}

        {/* Render current drawing polygon */}
        {currentDrawingPoints.length > 0 && (
          <LeafletPolygon
            positions={currentDrawingPoints}
            pathOptions={{
              color: "#ff4d4f",
              fillColor: "#ff4d4f",
              fillOpacity: 0.2,
              weight: 2,
              dashArray: "5, 5",
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
